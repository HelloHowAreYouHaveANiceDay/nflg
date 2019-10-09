import _ from "lodash";
import {
  Connection,
  ConnectionOptions,
  createConnections,
  getConnectionManager
} from "typeorm";
import GameWrapper from "../datasources/nfl/__archive__/game/GameWrapper";
import ScheduleWrapper, {
  scheduleWeekArgs
} from "../datasources/nfl/__archive__/schedule/ScheduleWrapper";
import { Drive } from "../Entities/Drive";
import { NFLSingleGameResponse } from "../datasources/nfl/entities/NFLSingleGameResponse";
import Play from "../Entities/Play";
import Player from "../Entities/Player";
import PlayPlayer from "../Entities/PlayPlayer";
import { Team, teamLookup } from "../Entities/Team";
import { Game } from "../Entities/Game";
import ProfileWrapper from "../datasources/nfl/__archive__/playerProfile/ProfileWrapper";
import EspnPlayer from "../Entities/EspnPlayer";
import EspnApi, { EspnApiParams } from "../datasources/espn/espnApi";
import EspnFantasyTeam from "../Entities/EspnFantasyTeam";
import { PlayersMaster } from "../Entities/PlayersMaster";
import { isEspnNflMatch } from "./Matches";
import { gameWeekArgs } from "../datasources/nfl/__archive__/schedule/gameWeekArgs";

export class NFLdb {
  chunk: 50;
  connection: Connection;
  nflSchedule: ScheduleWrapper;
  nflGame: GameWrapper;
  nflPlayer: ProfileWrapper;
  // espnPlayers: espnPlayersWrapper;

  espnApi: EspnApi;

  constructor(params: EspnApiParams) {
    this.nflSchedule = new ScheduleWrapper();
    this.nflGame = new GameWrapper();
    this.nflPlayer = new ProfileWrapper();
    this.espnApi = new EspnApi(params);
    // this.espnPlayers = new espnPlayersWrapper();
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

  async updateGameDetailsByConfig(params: gameWeekArgs) {
    try {
      const games = await this.getGamesByParams(params);
      const filteredGames = games.filter(g => g.quarter !== "P");
      for (var i = 0; i < filteredGames.length; ) {
        await this.cascadeGameDetailsUpdate(filteredGames[i].game_id);
        i++;
      }
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

  async updateDrivesFromGame(game: NFLSingleGameResponse) {
    try {
      const drives = await this.extractDriveEntities(game);
      await this.connection.manager.save(drives, { chunk: 50 });
    } catch (error) {
      throw error;
    }
  }

  async updatePlaysFromGame(game: NFLSingleGameResponse) {
    try {
      const plays = await this.extractPlayEntities(game);
      await this.connection.manager.save(plays, { chunk: 50 });
    } catch (error) {
      throw error;
    }
  }

  async updatePlayPlayersFromGame(game: NFLSingleGameResponse) {
    try {
      const playPlayers = await this.extractPlayPlayerEntities(game);
      await this.connection.manager.save(playPlayers, { chunk: 50 });
    } catch (error) {
      throw error;
    }
  }

  async updatePlayerStubsFromGame(game: NFLSingleGameResponse) {
    try {
      const playerStubs = await this.extractPlayerStubEntities(game);
      await this.connection.manager.save(playerStubs, { chunk: 50 });
    } catch (error) {
      throw error;
    }
  }

  private async extractDriveEntities(game: NFLSingleGameResponse) {
    try {
      const rawDrives = this.nflGame.parseDrives(game);
      return await Promise.all(
        rawDrives.map(d => this.connection.manager.create(Drive, d))
      );
    } catch (error) {
      throw error;
    }
  }

  private async extractPlayEntities(game: NFLSingleGameResponse) {
    try {
      const rawPlays = this.nflGame.parsePlays(game);
      return await Promise.all(
        rawPlays.map(p => this.connection.manager.create(Play, p))
      );
    } catch (error) {
      throw error;
    }
  }

  private async extractPlayPlayerEntities(game: NFLSingleGameResponse) {
    try {
      const rawPlayPlayers = this.nflGame.parsePlayPlayers(game);
      return await Promise.all(
        rawPlayPlayers.map(p => this.connection.manager.create(PlayPlayer, p))
      );
    } catch (error) {
      throw error;
    }
  }

  private async extractPlayerStubEntities(game: NFLSingleGameResponse) {
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

  ///////////
  // ESPN  //
  ///////////
  async updateAllEspnPlayers() {
    try {
      const players = await this.espnApi.getFantasyPlayers();
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

  async updateEspnFantasyTeams() {
    try {
      const teams = await this.espnApi.getFantasyTeams();
      const p = await Promise.all(
        teams.map((rawP: object) =>
          this.connection.manager.create(EspnFantasyTeam, rawP)
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

  async getGamesByParams(params: gameWeekArgs) {
    try {
      const games = await this.connection
        .createQueryBuilder(Game, "game")
        .where("game.year == :year", {
          year: params.year
        })
        .andWhere("game.week == :week", {
          week: params.week
        })
        .andWhere("game.game_type == :type", {
          type: params.season_type
        })
        .getMany();
      return games;
    } catch (error) {
      throw error;
    }
  }

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
      const players = await this.connection
        .createQueryBuilder(Player, "player")
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

  async getAllEspnPlayers() {
    try {
      const players = await this.connection
        .createQueryBuilder(EspnPlayer, "player")
        .getMany();
      return players;
    } catch (error) {
      throw error;
    }
  }

  async matchEspnNflPlayers() {
    try {
      const nflPlayers = await this.getAllPlayers();
      const espnPlayers = await this.getAllEspnPlayers();
      const matches: PlayersMaster[] = [];
      _.forEach(espnPlayers, p => {
        const nflMatch = _.find(nflPlayers, isEspnNflMatch(p));
        if (nflMatch) {
          matches.push({
            espn_id: p.espn_player_id,
            espn_full_name: p.full_name,
            espn_pos: p.position,
            nfl_id: nflMatch.player_id,
            nfl_full_name: nflMatch.full_name,
            nfl_pos: nflMatch.position
          });
        } else {
          matches.push({
            espn_id: p.espn_player_id,
            espn_full_name: p.full_name,
            espn_pos: p.position
          });
        }
      });
      const m = await Promise.all(
        matches.map((rawP: object) =>
          this.connection.manager.create(PlayersMaster, rawP)
        )
      );

      await this.connection.manager.save(m, { chunk: 10 });
    } catch (error) {
      throw error;
    }
  }
}
