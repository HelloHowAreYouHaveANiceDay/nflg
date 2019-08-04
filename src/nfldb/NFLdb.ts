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

  async findTeam(team_id: string) {
    let team = await this.connection
      .createQueryBuilder()
      .select("team")
      .from(Team, "team")
      .where("team.team_id = :id", { id: team_id })
      .getOne();
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
    return await this.insertGame(game, scheduleGame);
  }

  async insertDrives(game: nflApiGame) {}

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

      await this.connection
        .createQueryBuilder()
        .insert()
        .into(Game)
        .values(nflGame)
        .execute();

      console.log(
        `inserted ${scheduleGame.year}-week${scheduleGame.week}-${
          scheduleGame.gameid
        }`
      );
    } catch (error) {
      throw error;
    }
  }
}
