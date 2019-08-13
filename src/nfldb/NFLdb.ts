import _ from "lodash";
import {
  Connection,
  ConnectionOptions,
  createConnections,
  getConnectionManager
} from "typeorm";
import GameWrapper from "../apis/nfl/game/GameWrapper";
import ScheduleWrapper, {
  scheduleWeekArgs
} from "../apis/nfl/schedule/ScheduleWrapper";
import LocalCache from "../cache/LocalCache";
import { Drive } from "../Entities/Drive";
import { nflApiGameResponse } from "../apis/nfl/nflApiGame";
import Play from "../Entities/Play";
import Player from "../Entities/Player";
import PlayPlayer from "../Entities/PlayPlayer";
import { Team, teamLookup } from "../Entities/Team";
import { Game } from "../Entities/Game";

export class NFLdb {
  chunk: 100;
  connection: Connection;
  nflSchedule: ScheduleWrapper;
  nflGame: GameWrapper;

  constructor(cache?: LocalCache) {
    this.nflSchedule = new ScheduleWrapper();
    this.nflGame = new GameWrapper();
  }

  /**
   * sets up connection with sqlite
   * must run this first
   *
   * @param config
   */
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

  // updates the games table based on schedule API
  // async updateScheduleGames(config: { force: boolean }) {
  //   try {
  //   } catch (error) {}
  // }

  /**
   * Prefills the team table with hard coded teams
   */
  async setupTeams() {
    const teams = teamLookup;

    await _.forIn(teams, async (versions, key) => {
      const team = new Team();
      team.name = versions[1];
      team.team_id = key;
      team.city = versions[0];
      // team.players = [];

      await this.connection.manager.save(team);
    });
  }

  private async findTeamInDb(team_id: string) {
    try {
      let team = await this.connection
        .getRepository(Team)
        .createQueryBuilder("team")
        .where("team.team_id = :id", { id: team_id })
        .getOne();

      return team;
    } catch (error) {
      throw error;
    }
  }

  private lookupTeamId(teamString: string) {
    const ids = Object.keys(teamLookup);
    for (var i = 0; i < ids.length; i++) {
      //@ts-ignore
      if (_.includes(teamLookup[ids[i]], teamString)) {
        return ids[i];
      }
    }
    throw new Error(`team id: ${teamString} not found in teams library`);
  }

  async findTeam(team_id: string) {
    // look for team in database first
    let team = await this.findTeamInDb(team_id);

    if (team) {
      return team;
    }

    // check for team name against known versions
    const id = this.lookupTeamId(team_id);

    team = await this.findTeamInDb(id);

    if (team) {
      return team;
    } else {
      throw new Error(`cannot find team ${team_id}`);
    }
  }

  async updateScheduleGames(year: number, season_type?: string) {
    try {
      const weeks = this.nflSchedule.calculateWeeks(year, season_type);
      const games = await this.getGamesFromWeeks(weeks);
      const gameEntities = await Promise.all(
        games.map(async g => await this.connection.manager.create(Game, g))
      );

      await this.connection.manager.save(gameEntities, { chunk: this.chunk });
    } catch (error) {
      console.log(error);
    }
  }

  async getGamesFromWeeks(weeks: scheduleWeekArgs[]) {
    try {
      const rawGames = await Promise.all(
        _.map(weeks, this.nflSchedule.getWeekGames)
      );
      return _.flatten(rawGames);
    } catch (error) {
      throw error;
    }
  }

  async updateGameDetails(year: number, season_type?: string) {
    try {
      const games = await this.getGamesByYear(year);
      for (var i = 0; i < games.length; ) {
        await this.cascadeGameDetailsUpdate(games[i].game_id);
        i++;
      }
    } catch (error) {
      throw error;
    }
  }

  async cascadeGameDetailsUpdate(game_id: string) {
    try {
      const game = await this.nflGame.getGame(game_id);
      await this.updateDrivesFromGame(game);
      await this.updatePlaysFromGame(game);
      await this.updatePlayPlayersFromGame(game);
      await this.updatePlayerStubsFromGame(game);
      console.log(`updated: ${game_id}`);
    } catch (error) {
      throw error;
    }
  }

  async updateDrivesFromGame(game: nflApiGameResponse) {
    try {
      const drives = await this.extractDriveEntities(game);
      await this.connection.manager.save(drives, { chunk: 50 });
    } catch (error) {
      throw error;
    }
  }

  async updatePlaysFromGame(game: nflApiGameResponse) {
    try {
      const plays = await this.extractPlayEntities(game);
      await this.connection.manager.save(plays, { chunk: 50 });
    } catch (error) {
      throw error;
    }
  }

  async updatePlayPlayersFromGame(game: nflApiGameResponse) {
    try {
      const playPlayers = await this.extractPlayPlayerEntities(game);
      await this.connection.manager.save(playPlayers, { chunk: 50 });
    } catch (error) {
      throw error;
    }
  }

  async updatePlayerStubsFromGame(game: nflApiGameResponse) {
    try {
      const playerStubs = await this.extractPlayerStubEntities(game);
      await this.connection.manager.save(playerStubs, { chunk: 50 });
    } catch (error) {
      throw error;
    }
  }

  private async extractDriveEntities(game: nflApiGameResponse) {
    try {
      const rawDrives = this.nflGame.parseDrives(game);
      return await Promise.all(
        rawDrives.map(d => this.connection.manager.create(Drive, d))
      );
    } catch (error) {
      throw error;
    }
  }

  private async extractPlayEntities(game: nflApiGameResponse) {
    try {
      const rawPlays = this.nflGame.parsePlays(game);
      return await Promise.all(
        rawPlays.map(p => this.connection.manager.create(Play, p))
      );
    } catch (error) {
      throw error;
    }
  }

  private async extractPlayPlayerEntities(game: nflApiGameResponse) {
    try {
      const rawPlayPlayers = this.nflGame.parsePlayPlayers(game);
      return await Promise.all(
        rawPlayPlayers.map(p => this.connection.manager.create(PlayPlayer, p))
      );
    } catch (error) {
      throw error;
    }
  }

  private async extractPlayerStubEntities(game: nflApiGameResponse) {
    try {
      const rawPlayerStubs = this.nflGame.parsePlayerStubs(game);
      // console.log(rawPlayerStubs);
      return await Promise.all(
        rawPlayerStubs.map(p => this.connection.manager.create(Player, p))
      );
    } catch (error) {}
  }

  ////////////////////
  // Database Queries
  ///////////////////

  async getGamesByYear(year: number) {
    try {
      const games = await this.connection
        .createQueryBuilder(Game, "game")
        .where("game.year == :year", {
          year
        })
        .getMany();
      return games;
    } catch (error) {
      throw error;
    }
  }

  ////////////////////
  // Replaced Code
  ///////////////////

  // async insertGameBySchedule(params: scheduleSearchArgs) {
  //   try {
  //     const games = await nflGame.getInstance().searchSchedule(params);

  //     for (var i = 0; i < games.length; i++) {
  //       await this.insertSingleGame(games[i].game_id);
  //       i++;
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async updateGamesBySchedule(params: scheduleSearchArgs) {
  //   try {
  //     const games = await nflGame.getInstance().searchSchedule(params);
  //     for (var i = 0; i < games.length; i++) {
  //       const game = await nflGame.getInstance().getGame(games[i].game_id);
  //       await this.insertGame(game, games[i]);
  //       i++;
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async insertSingleGame(game_id: string) {
  //   try {
  //     // get scheduled game from nfl
  //     const scheduleGame = await nflGame.getInstance().getSingleGame(game_id);

  //     // get the detailed game info
  //     const game = await nflGame.getInstance().getGame(game_id);

  //     // insert game into database
  //     await this.insertGame(game, scheduleGame);

  //     // insert game's drives in to the database
  //     await this.insertDrives(game, scheduleGame);

  //     // insert plays, players, and the combination of play players into the database
  //     await this.insertPlayPlayers(game, scheduleGame);
  //     return true;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async insertPlayer(playerid: string) {
  //   try {
  //     const existingPlayer = await this.playerExistsInDb(playerid);

  //     if (existingPlayer) {
  //       return existingPlayer;
  //     }

  //     const player = await nflGame.getInstance().getPlayer(playerid);
  //     const nPlayer = await this.connection.manager.create(Player, player);
  //     return await this.connection.manager.save(nPlayer);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // private playerExistsInDb = async (player_id: string) => {
  //   try {
  //     const player = await this.connection
  //       .getRepository(Player)
  //       .createQueryBuilder("player")
  //       .where("player.player_id = :id", { id: player_id })
  //       .getOne();

  //     return player ? player : false;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  // /**
  //  * parses and inserts each playPlayer
  //  *
  //  * @param game
  //  * @param scheduleGame
  //  */
  // async insertPlayPlayers(game: nflApiGame, scheduleGame?: scheduleGame) {
  //   if (!scheduleGame) {
  //     throw new Error("scheduled game not found");
  //   }

  //   try {
  //     const drivesRaw = game.drives;

  //     const playPlayers: PlayPlayer[] = [];

  //     const playerIds: string[] = [];

  //     const plays: [string, string, string, nflPlay][] = [];

  //     _.forIn(drivesRaw, (drive, driveId) => {
  //       _.forIn(drive.plays, (play, playId) => {
  //         plays.push([scheduleGame.game_id, driveId, playId, play]);

  //         _.forIn(play.players, (sequence, playerId) => {
  //           const playPlayer = new PlayPlayer();
  //           playPlayer.game_id = scheduleGame.game_id;
  //           playPlayer.drive_id = driveId;
  //           playPlayer.play_id = playId;
  //           playPlayer.player_id = playerId;
  //           playerIds.push(playerId);

  //           sequence.forEach(stat => {
  //             // TODO: add relational
  //             playPlayer.team = stat.clubcode;

  //             const statdef = statsDict[`${stat.statId}`];

  //             if (statdef) {
  //               statdef.fields.forEach(field => {
  //                 const val = statdef.value ? statdef.value : 1;
  //                 //@ts-ignore
  //                 playPlayer[field] = val;
  //               });

  //               if (statdef.yds.length > 0) {
  //                 //@ts-ignore
  //                 playPlayer[statdef.yds] = stat.yards;
  //               }
  //             }
  //           });

  //           playPlayers.push(playPlayer);
  //         });
  //       });
  //     });

  //     const uniqueIds = _.uniq(_.filter(playerIds, k => k != "0"));
  //     // console.log(uniqueIds);
  //     await Promise.all(uniqueIds.map(p => this.insertPlayer(p)));

  //     await Promise.all(plays.map(this.insertPlay));

  //     await Promise.all(
  //       playPlayers.map(pp => this.connection.manager.save(pp))
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // insertPlay = async ([game_id, drive_id, play_id, play]: [
  //   string,
  //   string,
  //   string,
  //   nflPlay
  // ]) => {
  //   try {
  //     const nPlay = new Play();
  //     nPlay.game_id = game_id;
  //     nPlay.drive_id = drive_id;
  //     nPlay.play_id = play_id;
  //     nPlay.time = play.time;
  //     nPlay.pos_team = play.posteam;
  //     nPlay.yardline = this.positionToOffset(play.posteam, play.yrdln);
  //     nPlay.down = play.down;
  //     nPlay.yards_to_go = play.ydstogo;
  //     nPlay.description = play.desc;
  //     nPlay.note = play.note;
  //     // console.log(nPlay);
  //     return await this.connection.manager.save(nPlay);
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  // private driveRawToEntity = (game_id: string) => (
  //   rawDrive: nflDrive,
  //   drive_id: string
  // ) => {
  //   if (rawDrive.start) {
  //     const drive = new Drive();

  //     drive.game_id = game_id;
  //     drive.drive_id = drive_id;
  //     drive.start_field = this.positionToOffset(
  //       rawDrive.posteam,
  //       rawDrive.start.yrdln
  //     );
  //     drive.end_field = this.positionToOffset(
  //       rawDrive.posteam,
  //       rawDrive.end.yrdln
  //     );
  //     drive.first_downs = rawDrive.fds;
  //     drive.pos_team = rawDrive.posteam;
  //     drive.pos_time = rawDrive.postime;
  //     drive.play_count = rawDrive.numplays;
  //     drive.result = rawDrive.result;
  //     drive.penalty_yds = rawDrive.penyds;
  //     drive.yds_gained = rawDrive.ydsgained;
  //     drive.start_qtr = rawDrive.start.qtr;
  //     drive.start_time = rawDrive.start.time;
  //     drive.end_qtr = rawDrive.end.qtr;
  //     drive.end_time = rawDrive.end.time;

  //     return drive;
  //   }
  //   return false;
  // };

  // /**
  //  * inserts each drive
  //  * @param game
  //  * @param scheduleGame
  //  */
  // async insertDrives(game: nflApiGame, scheduleGame?: scheduleGame) {
  //   if (!scheduleGame) {
  //     throw new Error("scheduled game not found");
  //   }

  //   const drivesRaw = game.drives;

  //   const drives = _.transform(
  //     drivesRaw,
  //     (r: Drive[], v, k) => {
  //       const d = this.driveRawToEntity(scheduleGame.game_id)(v, k);
  //       if (d) {
  //         r.push(d);
  //       }
  //     },
  //     []
  //   );

  //   await this.connection.manager.save(drives);
  // }

  // /**
  //  * positional offset parser so play yardage is
  //  * stored agnostically
  //  *
  //  * @param own
  //  * @param yrdln
  //  */
  // positionToOffset(own: string, yrdln: string) {
  //   // Uses a varied offset technique than burntsushi/nfldb
  //   // Own -50 -40 -30 -20 -10 0 10 20 30 40 50 Opp
  //   // Don't have to fiddle with embedded names

  //   // if yrdln is 50 there isn't a team string
  //   if (yrdln == "50") {
  //     return 0;
  //   }
  //   const [team, yard] = yrdln.split(" ");
  //   return team == own ? +yard - 50 : 50 - +yard;
  // }

  // /**
  //  * converts the offset back with given team names
  //  *
  //  * @param own
  //  * @param opp
  //  * @param offset
  //  */
  // offsetToPosition(own: string, opp: string, offset: number) {
  //   const pos = offset > 0 ? opp : own;
  //   const yds = offset > 0 ? 50 - offset : offset + 50;
  //   return `${pos} ${yds}`;
  // }

  // async insertGame(game: nflApiGame, scheduleGame?: scheduleGame) {
  //   try {
  //     if (!scheduleGame) {
  //       throw new Error("scheduled game not found");
  //     }

  //     const nflGame = new Game();
  //     nflGame.gameid = scheduleGame.game_id;
  //     nflGame.wday = scheduleGame.weekday;
  //     nflGame.season_type = scheduleGame.season_type;
  //     nflGame.finished =
  //       scheduleGame.quarter == "F" || scheduleGame.quarter == "final overtime";
  //     nflGame.home_score = scheduleGame.home_score;
  //     nflGame.year = scheduleGame.year;
  //     nflGame.week = scheduleGame.week;
  //     nflGame.game_type = scheduleGame.game_type;
  //     nflGame.home_score_q1 = game.home.score["1"];
  //     nflGame.home_score_q2 = game.home.score["2"];
  //     nflGame.home_score_q3 = game.home.score["3"];
  //     nflGame.home_score_q4 = game.home.score["4"];
  //     nflGame.home_score_q5 = game.home.score["5"];
  //     nflGame.away_score = scheduleGame.away_score;
  //     nflGame.away_score_q1 = game.away.score["1"];
  //     nflGame.away_score_q2 = game.away.score["2"];
  //     nflGame.away_score_q3 = game.away.score["3"];
  //     nflGame.away_score_q4 = game.away.score["4"];
  //     nflGame.away_score_q5 = game.away.score["5"];
  //     nflGame.home_turnovers = game.home.to;
  //     nflGame.away_turnovers = game.away.to;
  //     nflGame.home_team = await this.findTeam(game.home.abbr);
  //     nflGame.away_team = await this.findTeam(game.away.abbr);

  //     // console.log(nflGame);

  //     await this.connection.manager.save(nflGame);
  //     console.log(
  //       `Updated ${scheduleGame.year}-week ${scheduleGame.week}-${
  //         scheduleGame.game_id
  //       }`
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
