import {
  Connection,
  createConnection,
  ConnectionOptions,
  getConnection
} from "typeorm";
import { nflApiGame, nflApiGameResponse } from "../Entities/nflApiGame";
import nflGame from "../nflgame/nflgame";
import { Game } from "../Entities/Game";
import { scheduleGame } from "../nflgame/nflApi";
import { teamLookup, Team } from "../Entities/Team";
import _ from "lodash";

export class NFLdb {
  connection: Connection;

  constructor() {}

  async setup(config?: ConnectionOptions) {
    if (config) {
      this.connection = await createConnection(config);
    } else {
      this.connection = await createConnection();
    }
  }

  async update() {
    //ge
  }

  // add a game and its data to the database
  async addGame(gameid: string) {
    // get game from nflgame
    // insert Game
    // insert Plays
    // insert PlayPlayers
    // insert Players
  }

  async setupTeams() {
    const teams = teamLookup;
    const t: Team[] = [];
    _.forIn(teams, (versions, key) => {
      const team: Team = {
        name: versions[1],
        team_id: key,
        city: versions[0],
        players: []
      };
      t.push(team);
    });

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Team)
      .values(t)
      .execute();
  }

  async insertGame(
    gameid: string,
    game: nflApiGame,
    scheduleGame: scheduleGame
  ) {
//     const nflGame: Game = {
//       gameid: gameid,
//       wday: scheduleGame.wday,
//       season_type: scheduleGame.gameType,
//       finished: scheduleGame.quarter == "Final",
//       home_score: scheduleGame.homeScore,
//       home_score_q1: game.home.score["1"],
//       home_score_q2: game.home.score["2"],
//       home_score_q3: game.home.score["3"],
//       home_score_q4: game.home.score["4"],
//       home_score_q5: game.home.score["5"],
//       away_score: scheduleGame.awayScore,
//       away_score_q1: game.away.score["1"],
//       away_score_q2: game.away.score["2"],
//       away_score_q3: game.away.score["3"],
//       away_score_q4: game.away.score["4"],
//       away_score_q5: game.away.score["5"],
//       home_turnovers: game.home.to,
//       away_turnovers: game.away.to
//     };

//     await this.connection
//       .createQueryBuilder()
//       .insert()
//       .into(Game)
//       .values(nflGame)
//       .execute();
//   }
}
