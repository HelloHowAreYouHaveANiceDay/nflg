import {
  Connection,
  createConnections,
  ConnectionOptions,
  getConnection,
  getConnectionManager
} from "typeorm";
import { nflApiGame, nflApiGameResponse } from "../Entities/nflApiGame";
import nflGame from "../nflgame/nflgame";
import { Game } from "../Entities/Game";
import { scheduleGame } from "../nflgame/nflApi";
// import { Team } from "../Entities/Team";
import { teamLookup, Team } from "../Entities/Team";
import _ from "lodash";
import { Drive } from "../Entities/Drive";
import PlayPlayer from "../Entities/PlayPlayer";
import { statsDict } from "../nflgame/Stats";
import Player from "../Entities/Player";

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

  async _insertGame(gameid: string) {
    const scheduleGame = await nflGame.getInstance().getSingleGame(gameid);
    const game = await nflGame.getInstance().getGame(gameid);
    await this.insertGame(game, scheduleGame);
    await this.insertDrives(game, scheduleGame);
    return await this.insertPlayPlayers(game, scheduleGame);
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

  async insertPlayPlayers(game: nflApiGame, scheduleGame?: scheduleGame) {
    if (!scheduleGame) {
      throw new Error("scheduled game not found");
    }

    const drivesRaw = game.drives;

    const playPlayers: PlayPlayer[] = [];

    const playerIds: string[] = [];

    _.forIn(drivesRaw, (drive, driveId) => {
      _.forIn(drive.plays, (play, playId) => {
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
    // await this.insertPlayer(uniqueIds[0]);
    await Promise.all(playPlayers.map(pp => this.connection.manager.save(pp)));
  }

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

      const nflGame: Game = {
        gameid: scheduleGame.gameid,
        wday: scheduleGame.wday,
        season_type: scheduleGame.gameType,
        finished: scheduleGame.quarter == "F",
        home_score: scheduleGame.homeScore,
        home_score_q1: game.home.score["1"],
        home_score_q2: game.home.score["2"],
        home_score_q3: game.home.score["3"],
        home_score_q4: game.home.score["4"],
        home_score_q5: game.home.score["5"],
        away_score: scheduleGame.awayScore,
        away_score_q1: game.away.score["1"],
        away_score_q2: game.away.score["2"],
        away_score_q3: game.away.score["3"],
        away_score_q4: game.away.score["4"],
        away_score_q5: game.away.score["5"],
        home_turnovers: game.home.to,
        away_turnovers: game.away.to,
        home_team: await this.findTeam(game.home.abbr),
        away_team: await this.findTeam(game.away.abbr)
      };

      const gameUpdate = await this.connection.manager.preload(Game, nflGame);
      await this.connection.manager.save(gameUpdate);
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
