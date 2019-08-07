import {
  Connection,
  createConnections,
  ConnectionOptions,
  getConnectionManager
} from "typeorm";
import _ from "lodash";
import { nflApiGame, nflPlay } from "../Entities/nflApiGame";
import nflGame from "../nflgame/nflgame";
import { Game } from "../Entities/Game";
import { scheduleGame } from "../nflgame/nflApi";
import { teamLookup, Team } from "../Entities/Team";
import { Drive } from "../Entities/Drive";
import PlayPlayer from "../Entities/PlayPlayer";
import { statsDict } from "../nflgame/Stats";
import Player from "../Entities/Player";
import Play from "../Entities/Play";

export class NFLdb {
  connection: Connection;

  constructor() {}

  async setup(config?: ConnectionOptions[]) {
    if (config) {
      console.log("nfldb initiated with configuration");
      await createConnections(config);
      this.connection = getConnectionManager().get(process.env.NODE_ENV);
    } else {
      console.log("nfldb initiated with configuration file");
      await createConnections();
      this.connection = getConnectionManager().get(process.env.NODE_ENV);
    }
  }

  async setupTeams() {
    const teams = teamLookup;
    // const t: Team[] = [];

    await _.forIn(teams, async (versions, key) => {
      const team = new Team();
      team.name = versions[1];
      team.team_id = key;
      team.city = versions[0];
      team.players = [];

      await this.connection.manager.save(team);
    });
  }

  async findTeam(team_id: string) {
    // console.log(`looking for: ${team_id}`);

    let team = await this.connection
      .getRepository(Team)
      .createQueryBuilder("team")
      .where("team.team_id = :id", { id: team_id })
      .getOne();

    // console.log(`find by id result:${team}`);

    if (team) {
      return team;
    }

    let id;
    await _.forIn(teamLookup, async (value, key) => {
      const is = _.includes(value, team_id);
      if (is) {
        id = key;
      }
    });

    team = await this.connection
      .createQueryBuilder()
      .select("team")
      .from(Team, "team")
      .where("team.team_id = :id", { id: id })
      .getOne();

    if (team) {
      return team;
    } else {
      throw new Error(`cannot find team ${team_id}`);
    }
  }

  async insertSingleGame(gameid: string) {
    try {
      const scheduleGame = await nflGame.getInstance().getSingleGame(gameid);
      const game = await nflGame.getInstance().getGame(gameid);
      await this.insertGame(game, scheduleGame);
      await this.insertDrives(game, scheduleGame);
      await this.insertPlayPlayers(game, scheduleGame);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async insertPlayer(playerid: string) {
    const player = await nflGame.getInstance().getPlayer(playerid);
    console.log(player);
    const pPlayer = await this.connection.manager.preload(Player, player);
    if (pPlayer) {
      return await this.connection.manager.save(pPlayer);
    }
    const nPlayer = await this.connection.manager.create(Player, player);
    return await this.connection.manager.save(nPlayer);
  }

  /**
   * parses and inserts each play
   * @param game
   * @param scheduleGame
   */
  async insertPlayPlayers(game: nflApiGame, scheduleGame?: scheduleGame) {
    if (!scheduleGame) {
      throw new Error("scheduled game not found");
    }

    const drivesRaw = game.drives;

    const playPlayers: PlayPlayer[] = [];

    const playerIds: string[] = [];

    const plays: [string, string, string, nflPlay][] = [];

    _.forIn(drivesRaw, (drive, driveId) => {
      _.forIn(drive.plays, (play, playId) => {
        plays.push([scheduleGame.gameid, driveId, playId, play]);
        _.forIn(play.players, (sequence, playerId) => {
          const playPlayer = new PlayPlayer();
          playPlayer.gsis_id = scheduleGame.gameid;
          playPlayer.drive_id = driveId;
          playPlayer.play_id = playId;
          playPlayer.player_id = playerId;
          playerIds.push(playerId);

          sequence.forEach(stat => {
            // TODO: add relational
            playPlayer.team = stat.clubcode;

            const statdef = statsDict[`${stat.statId}`];

            statdef.fields.forEach(field => {
              const val = statdef.value ? statdef.value : 1;
              //@ts-ignore
              playPlayer[field] = val;
            });

            if (statdef.yds.length > 0) {
              //@ts-ignore
              playPlayer[statdef.yds] = stat.yards;
            }
          });

          playPlayers.push(playPlayer);
        });
      });
    });

    const uniqueIds = _.uniq(_.filter(playerIds, k => k != "0"));
    // console.log(uniqueIds);
    await uniqueIds.map(p => this.insertPlayer(p));

    await Promise.all(plays.map(this.insertPlay));

    await Promise.all(playPlayers.map(pp => this.connection.manager.save(pp)));
  }

  insertPlay = async ([game_id, drive_id, play_id, play]: [
    string,
    string,
    string,
    nflPlay
  ]) => {
    try {
      const nPlay = new Play();
      nPlay.game_id = game_id;
      nPlay.drive_id = drive_id;
      nPlay.play_id = play_id;
      nPlay.time = play.time;
      nPlay.pos_team = play.posteam;
      nPlay.yardline = this.positionToOffset(play.posteam, play.yrdln);
      nPlay.down = play.down;
      nPlay.yards_to_go = play.ydstogo;
      nPlay.description = play.desc;
      nPlay.note = play.note;
      // console.log(nPlay);
      return await this.connection.manager.save(nPlay);
    } catch (error) {
      throw error;
    }
  };

  /**
   * inserts each drive
   * @param game
   * @param scheduleGame
   */
  async insertDrives(game: nflApiGame, scheduleGame?: scheduleGame) {
    if (!scheduleGame) {
      throw new Error("scheduled game not found");
    }

    const drivesRaw = game.drives;

    const drives: Drive[] = [];

    _.forIn(drivesRaw, (value, key) => {
      if (value.start) {
        const drive = new Drive();

        drive.gsis_id = scheduleGame.gameid;
        drive.drive_id = key;
        drive.start_field = this.positionToOffset(
          value.posteam,
          value.start.yrdln
        );
        drive.end_field = this.positionToOffset(value.posteam, value.end.yrdln);
        drive.first_downs = value.fds;
        drive.pos_team = value.posteam;
        drive.pos_time = value.postime;
        drive.play_count = value.numplays;
        drive.result = value.result;
        drive.penalty_yards = value.penyds;
        drive.yards_gained = value.ydsgained;
        drive.start_qtr = value.start.qtr;
        drive.start_time = value.start.time;
        drive.end_qtr = value.end.qtr;
        drive.end_time = value.end.time;
        drives.push(drive);
      }
    });

    await this.connection.manager.save(drives);
  }

  /**
   * positional offset parser so play yardage is
   * stored agnostically
   *
   * @param own
   * @param yrdln
   */
  positionToOffset(own: string, yrdln: string) {
    // Uses a varied offset technique than burntsushi/nfldb
    // Own -50 -40 -30 -20 -10 0 10 20 30 40 50 Opp
    // Don't have to fiddle with embedded names

    // if yrdln is 50 there isn't a team string
    if (yrdln == "50") {
      return 0;
    }
    const [team, yard] = yrdln.split(" ");
    return team == own ? +yard - 50 : 50 - +yard;
  }

  /**
   * converts the offset back with given team names
   *
   * @param own
   * @param opp
   * @param offset
   */
  offsetToPosition(own: string, opp: string, offset: number) {
    const pos = offset > 0 ? opp : own;
    const yds = offset > 0 ? 50 - offset : offset + 50;
    return `${pos} ${yds}`;
  }

  async insertGame(game: nflApiGame, scheduleGame?: scheduleGame) {
    try {
      if (!scheduleGame) {
        throw new Error("scheduled game not found");
      }

      // const nflGame: Game = {
      const nflGame = new Game();
      nflGame.gameid = scheduleGame.gameid;
      nflGame.wday = scheduleGame.wday;
      nflGame.season_type = scheduleGame.gameType;
      nflGame.finished = scheduleGame.quarter == "F";
      nflGame.home_score = scheduleGame.homeScore;
      nflGame.home_score_q1 = game.home.score["1"];
      nflGame.home_score_q2 = game.home.score["2"];
      nflGame.home_score_q3 = game.home.score["3"];
      nflGame.home_score_q4 = game.home.score["4"];
      nflGame.home_score_q5 = game.home.score["5"];
      nflGame.away_score = scheduleGame.awayScore;
      nflGame.away_score_q1 = game.away.score["1"];
      nflGame.away_score_q2 = game.away.score["2"];
      nflGame.away_score_q3 = game.away.score["3"];
      nflGame.away_score_q4 = game.away.score["4"];
      nflGame.away_score_q5 = game.away.score["5"];
      nflGame.home_turnovers = game.home.to;
      nflGame.away_turnovers = game.away.to;
      nflGame.home_team = await this.findTeam(game.home.abbr);
      nflGame.away_team = await this.findTeam(game.away.abbr);
      // };

      // const gameUpdate = await this.connection.manager.preload(Game, nflGame);
      await this.connection.manager.save(nflGame);
      console.log(
        `Updated ${scheduleGame.year}-week ${scheduleGame.week}-${
          scheduleGame.gameid
        }`
      );
    } catch (error) {
      throw error;
    }
  }
}
