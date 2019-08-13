import jsonCache from "../cache/jsonCache";
import Player from "../Entities/Player";
import NFLApi from "../apis/nfl/nflApi";
import { scheduleGame } from "../apis/nfl/schedule/scheduleGame";
import _ from "lodash";
import { nflApiGame, nflApiGameResponse } from "../apis/nfl/nflApiGame";
import { parseProfile } from "../apis/nfl/nflPlayer";
// import { getPlayerStats } from "../temp/Game";
import { gameSearchArgs, Game } from "../Entities/Game";

function transposeArgs(args: gameSearchArgs) {
  const params: any = {
    homeShort: args.home,
    awayShort: args.away,
    gameType: args.seasonType,
    week: args.week,
    year: args.year
  };
  return _.omitBy(params, _.isUndefined);
}

export default class nflGame {
  private static instance: nflGame;
  private static filePath: string;
  cache: jsonCache;
  nflApi: NFLApi;
  schedule: scheduleGame[];
  players: {
    [key: string]: Player;
  };

  private constructor(filePath: string) {
    nflGame.filePath = filePath;
    this.cache = new jsonCache(filePath);
    //@ts-ignore
    this.schedule = this.cache.getSchedule();
    this.players = this.cache.getPlayerList();
  }

  static getInstance(filePath?: string) {
    if (!nflGame.instance && filePath) {
      nflGame.instance = new nflGame(filePath);
      return nflGame.instance;
    } else if (filePath != nflGame.filePath && filePath) {
      nflGame.instance = new nflGame(filePath);
      return nflGame.instance;
    } else if (!nflGame.instance && !filePath) {
      throw new Error("filepath is not set, cannot retrieve cache");
    } else {
      return nflGame.instance;
    }
  }

  async regenerateSchedule() {
    try {
      const gamesTillNow = await NFLApi.yearPhaseWeek();
      const games = await Promise.all(gamesTillNow.map(NFLApi.getWeekSchedule));
      //@ts-ignore
      const save = await this.cache.saveSchedule(_.flatten(games));
      return save;
    } catch (err) {
      throw err;
    }
  }

  mountGameDetails = async (scheduleGame: scheduleGame) => {
    const gameDetails = await this.getGame(scheduleGame.game_id);
    const game = {
      gameid: scheduleGame.game_id,
      wday: scheduleGame.weekday,
      month: scheduleGame.month,
      quarter: scheduleGame.quarter,
      day: scheduleGame.day,
      gameType: scheduleGame.game_type,
      homeShort: scheduleGame.home_short,
      homeName: scheduleGame.home_name,
      homeScore: gameDetails.home.score.T,
      awayShort: scheduleGame.away_short,
      awayName: scheduleGame.away_name,
      awayScore: gameDetails.away.score.T,
      redzone: gameDetails.redzone,
      yl: gameDetails.yl,
      media: gameDetails.media ? gameDetails.media : "",
      clock: gameDetails.clock,
      weather: gameDetails.weather ? gameDetails.weather : "",
      homeScore_q1: gameDetails.home.score["1"],
      homeScore_q2: gameDetails.home.score["2"],
      homeScore_q3: gameDetails.home.score["3"],
      homeScore_q4: gameDetails.home.score["4"],
      awayScore_q1: gameDetails.away.score["1"],
      awayScore_q2: gameDetails.away.score["2"],
      awayScore_q3: gameDetails.away.score["3"],
      awayScore_q4: gameDetails.away.score["4"]
    };
    return game;
  };

  async searchSchedule(args: gameSearchArgs) {
    // console.log(transposeArgs(args));
    let games: scheduleGame[] = [];
    try {
      if (this.schedule.length < 1) {
        await this.regenerateSchedule();
        // TODO: figure out why this is producing a type error
        //@ts-ignore
        games = _.filter(this.schedule, transposeArgs(args));
      } else {
        //@ts-ignore
        games = _.filter(this.schedule, transposeArgs(args));
      }
      // const mountedGames = await games.map(this.mountGameDetails);
      return games;
      // return mountedGames;
    } catch (err) {
      throw err;
    }
  }

  async getSingleGame(gameid: string) {
    try {
      const game = _.find(this.schedule, { game_id: gameid });
      if (game) {
        // return await this.mountGameDetails(game);
        return game;
      }
    } catch (err) {
      throw err;
    }
  }

  async getGame(gameid: string): Promise<nflApiGame> {
    try {
      const nflGame = await this.getGamecenterGame(gameid);
      return nflGame;
    } catch (error) {
      // console.error(error);
      throw error;
    }
  }

  async getGamecenterGame(gameid?: string) {
    if (!gameid) {
      throw new Error("no gameid passed");
    }
    try {
      const cacheGame = await this.cache.getGame(gameid);
      console.log("game found in cache");
      cacheGame.gameid = gameid;
      return cacheGame;
    } catch (err) {
      console.log("game is not found in cache, pulling from nfl.com");
      try {
        const gameResponse = await this.fetchGame(gameid);
        await this.cache.saveGame(gameid, gameResponse);
        // @ts-ignore
        gameResponse.gameid = gameid;
        return gameResponse;
      } catch (error) {
        throw error;
      }
    }
  }

  private async fetchGame(gameid: string) {
    try {
      const game: nflApiGame = await NFLApi.getGame(gameid);
      return game;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async fetchPlayer(gsisId: string) {
    try {
      const html = await NFLApi.getPlayerProfile(gsisId);
      const player = parseProfile(html);
      player.player_id = gsisId;
      this.players[gsisId] = player;
      await this.cache.savePlayerList(this.players);
      return player;
    } catch (error) {
      // console.error(error);
      throw error;
    }
  }

  async getPlayer(gsisId: string) {
    if (gsisId == "XX-0000001") {
      return {
        fullName: "Not a Player",
        player_id: "XX-0000001",
        firstName: "NAP",
        gsisId: "XX-0000001",
        lastName: "NAP",
        birthcity: "",
        birthdate: "",
        college: "",
        profile_url: "",
        profile_id: "",
        number: 0,
        position: "",
        weight: 0,
        height: 0
      };
    }

    try {
      const match = _.filter(this.players, { gsisId: gsisId });
      if (match.length < 1) {
        console.log(`${gsisId} player not found... fetching`);
        const player = await this.fetchPlayer(gsisId);
        console.log(`added ${player.full_name}`);
        return player;
      } else {
        console.log("player found");
        return match[0];
      }
    } catch (err) {
      console.error(err);
      return {};
    }
  }
}
