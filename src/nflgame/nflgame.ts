import jsonCache from './jsonCache';
import Player from '../schemas/Player';
import NFLApi from './nflApi';
import { searchScheduleArgs, Schedule } from '../schemas/Schedule';
import _ from 'lodash';
import { nflApiGame, nflApiGameResponse } from '../schemas/nflApiGame';
import { parseProfile } from './nflPlayer';
import { getPlayerStats, parseGame } from './Game';

function transposeArgs(args: searchScheduleArgs) {
    const params: any = {
        homeShort: args.home,
        awayShort: args.away,
        gameType: args.season_type,
        week: args.week,
        year: args.year
    }
    return _.omitBy(params, _.isUndefined);
}

export default class nflGame {
    private static instance: nflGame;
    private static filePath: string;
    cache: jsonCache;
    nflApi: NFLApi;
    schedule: Schedule[];
    players: Player[];

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
            nflGame.instance = new nflGame(filePath)
            return nflGame.instance;
        } else if (!nflGame.instance && !filePath) {
            throw new Error('filepath is not set, cannot retrieve cache')
        } else {
            return nflGame.instance
        }
    }

    async regenerateSchedule() {
        try {
            const gamesTillNow = await NFLApi.yearPhaseWeek();
            const games = await Promise.all(gamesTillNow.map(NFLApi.getWeekSchedule));
            //@ts-ignore
            const save = await this.cache.saveSchedule(_.flatten(games))
            return save;
        } catch (err) {
            throw err;
        }
    }

    async searchSchedule(args: searchScheduleArgs) {
        // console.log(transposeArgs(args));
        try {
            if (this.schedule.length < 1) {
                await this.regenerateSchedule();
                return _.filter(this.schedule, transposeArgs(args));
            } else {
                return _.filter(this.schedule, transposeArgs(args));
            }
        } catch (err) {
            throw err;
        }
    }

    async updatePlayers() {
        // not needed as players can be fetched on the fly
    }

    async getGame(gameid: string) {
        const nflGame = await this.getGamecenterGame(gameid);
        const game = parseGame(nflGame);
        game.gameid = gameid;
        return game;
    }


    async getGamecenterGame(gameid?: string) {
        if(!gameid) {
            throw new Error('no gameid passed')
        }
        try {
            const cacheGame = await this.cache.getGame(gameid);
            if (!cacheGame) {
                console.log('game is not found in cache, pulling from nfl.com')
                // if cached game is not found,
                // we fetch the game from NFL.com
                const gameResponse = await this.fetchGame(gameid);
                // and save it to cache
                await this.cache.saveGame(gameid, gameResponse);
                // before returning it to the user
                // @ts-ignore
                gameResponse.gameid = gameid;
                return gameResponse;
            } else {
                // if the game is found in cache that is returned instead.
                console.log('game found in cache')
                cacheGame.gameid = gameid;
                return cacheGame;
            }
        } catch (err) {
            throw err;
        }
    }

    async getAggGameStats(gameid: string) {
        try {
            const game = await this.getGamecenterGame(gameid);
            return getPlayerStats(game);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    private async fetchGame(gameid: string) {
        try {
            const game: nflApiGame = await NFLApi.getGame(gameid)
            return game
        } catch (error) {
            throw error
        }
    }

    private async fetchPlayer(gsisId: string) {
        const html = await NFLApi.getPlayerProfile(gsisId)
        const player = parseProfile(html);
        await this.players.push(player);
        await this.cache.savePlayerList(this.players);
        return player
    }

    async getPlayer(gsisId: string) {
        const match = _.filter(this.players, { gsisId: gsisId });
        if (match.length == 0) {
            return await this.fetchPlayer(gsisId)
        } else {
            return match[0];
        }
    }

    async getGamesBySchedule(params: searchScheduleArgs) {
        const match = params
        // console.log(match)
        return _.filter(this.schedule, match);
    }
}