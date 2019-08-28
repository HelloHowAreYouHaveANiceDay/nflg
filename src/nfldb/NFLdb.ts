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
import ProfileWrapper from "../apis/nfl/playerProfile/ProfileWrapper";
import espnPlayersWrapper from "../apis/espn/players/espnPlayersWrapper";
import EspnPlayer from "../Entities/EspnPlayer";
import { filter } from "minimatch";

export class NFLdb {
  chunk: 50;
  connection: Connection;
  nflSchedule: ScheduleWrapper;
  nflGame: GameWrapper;
  nflPlayer: ProfileWrapper;
  espnPlayers: espnPlayersWrapper;

  constructor(cache?: string) {
    if (cache) {
      const c = new LocalCache(cache);
      this.nflSchedule = new ScheduleWrapper();
      this.nflGame = new GameWrapper();
      this.nflPlayer = new ProfileWrapper();
      this.espnPlayers = new espnPlayersWrapper();
    } else {
      this.nflSchedule = new ScheduleWrapper();
      this.nflGame = new GameWrapper();
      this.nflPlayer = new ProfileWrapper();
      this.espnPlayers = new espnPlayersWrapper();
    }
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

  async updateCurrentGames() {
    try {
      const currentWeek = await this.nflSchedule.getCurrentWeek();
      const games = await this.getGamesFromWeeks([currentWeek]);
      const gameEntities = await Promise.all(
        games.map(async g => await this.connection.manager.create(Game, g))
      );
      await this.connection.manager.save(gameEntities, { chunk: this.chunk });
    } catch (error) {
      throw error;
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
      const filteredGames = games.filter(g => g.quarter !== "P");
      for (var i = 0; i < filteredGames.length; ) {
        await this.cascadeGameDetailsUpdate(filteredGames[i].game_id);
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

  // Player Profile
  async updateAllPlayers() {
    try {
      const players = await this.getAllPlayers();
      await Promise.all(players.map(p => this.updatePlayer(p.player_id)));
    } catch (error) {
      throw error;
    }
  }

  async updateStubPlayers() {
    try {
      const players = await this.getStubPlayers();
      await Promise.all(players.map(p => this.updatePlayer(p.player_id)));
    } catch (error) {
      throw error;
    }
  }

  // Player Profile will time out if too many requests are ongoing
  async updatePlayer(player_id: string) {
    try {
      const rawPlayer = await this.nflPlayer.getPlayerProfile(player_id);
      if (Object.values(rawPlayer).length > 0) {
        await this.connection.manager.update(Player, player_id, rawPlayer);
        console.log(`${rawPlayer.full_name} updated`);
      } else {
        console.log(`${player_id} invalid: skipped`);
      }
      return;
    } catch (error) {
      throw error;
    }
  }

  async updateAllEspnPlayers() {
    try {
      const players = await this.espnPlayers.getFantasyPlayers();
      const p = await Promise.all(
        players.map((rawP: object) =>
          this.connection.manager.create(EspnPlayer, rawP)
        )
      );
      // console.log(p);
      await this.connection.manager.save(p, { chunk: 10 });
    } catch (error) {
      throw error;
    }
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

  async getAllPlayers() {
    try {
      // const players = await this.connection.query("select * from player");
      const players = await this.connection
        .createQueryBuilder(Player, "player")
        // .where("game.year == :year", {
        //   year
        // })
        .getMany();
      return players;
    } catch (error) {
      throw error;
    }
  }

  async getStubPlayers() {
    try {
      const players = await this.connection
        .createQueryBuilder(Player, "player")
        .where("player.college IS NULL")
        .andWhere("Player.height IS NULL")
        .andWhere("Player.weight IS NULL")
        .andWhere("Player.full_name IS NULL")
        .getMany();
      return players;
    } catch (error) {
      throw error;
    }
  }
}
