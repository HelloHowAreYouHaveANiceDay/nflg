import jsonCache from './jsonCache';
import Game from '../schemas/Game';
import Player from '../schemas/Player';
import NFLApi from './nflApi';
import { scheduleSearchArgs } from './Schedule';
import _ from 'lodash';
import { nflApiGame, nflApiGameResponse } from '../schemas/nflApiGame';

export default class nflGame {
    cache: jsonCache;
    nflApi: NFLApi;
    schedule: Game[];
    players: Player[];

    constructor(filePath: string) {
        this.cache = new jsonCache(filePath);
    }

    async regenerateSchedule() {
        try {
            const gamesTillNow = await NFLApi.yearPhaseWeek();
            const games = await Promise.all(gamesTillNow.map(NFLApi.getWeekSchedule));
            const save = await this.cache.saveSchedule(_.flatten(games))
            return save;
        } catch (err) {
            throw err;
        }
    }

    async updatePlayers() {

    }



    async getGame(gameid: string) {
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
                return gameResponse;
            } else {
                // if the game is found in cache that is returned instead.
                console.log('game found in cache')
                return cacheGame;
            }
        } catch (err) {
            throw err;
        }
    }

    async fetchGame(gameid: string) {
        try {
            const game: nflApiGame = await NFLApi.getGame(gameid)
            return game
        } catch (error) {
            throw error
        }
    }

    async getPlayer(playerid: string) {

    }

    async getGamesBySchedule(params: scheduleSearchArgs) {
        const match = params
        console.log(match)
        return _.filter(this.games, match);
    }
}

// function getWeeksByYearPhase(year: number, phase: 'PRE' | 'POST' | 'REG') {
//     const weeks: (string | number)[][] = [];

//     if (phase == 'POST') {
//         _.range(1, 5).forEach((week) => weeks.push([year, 'POST', week]))
//     } else if (phase == 'PRE') {
//         _.range(0, 5).forEach((week) => weeks.push([year, 'PRE', week]))
//     } else {
//         _.range(1, 18).forEach((week) => weeks.push([year, 'REG', week]))
//     }

//     return weeks
// }