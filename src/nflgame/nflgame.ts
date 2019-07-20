import jsonCache from './jsonCache';
import Game from '../schemas/Game';
import Player from '../schemas/Player';
import NFLApi from './nflApi';
import { scheduleSearchArgs } from './schedule/nflSchedule';

export default class nflGame {
    cache: jsonCache;
    nflApi: NFLApi;
    games: Game[];
    players: Player[];

    constructor(filePath: string) {
        this.cache = new jsonCache(filePath);
    }

    async updateSchedule() {
        const currentSchedule = await this.cache.getSchedule();
        console.log(currentSchedule);
        // get local json file
        // check local access
    }

    async updatePlayers() {

    }

    async getGame(gameid: string) {
        try {
            const cacheGame = await this.cache.getGame(gameid);
        } catch{
            
        }
    }

    async fetchGame(gameid: string){
        try {
            const game = await NFLApi.getGame(gameid)
            return game
        } catch (error) {
            throw error
        }
    }

    async getPlayer(playerid: string) {

    }

    async getGamesBySchedule(params: scheduleSearchArgs) {

    }
}

const _range = (start: number, end: number, length = end - start) =>
    Array.from({ length }, (_, i) => start + i)

export function getWeeksByYearPhase(year: number, phase: 'PRE' | 'POST' | 'REG') {
    const weeks: (string | number)[][] = [];

    if (phase == 'POST') {
        _range(1, 5).forEach((week) => weeks.push([year, 'POST', week]))
    } else if (phase == 'PRE') {
        _range(0, 5).forEach((week) => weeks.push([year, 'PRE', week]))
    } else {
        _range(1, 18).forEach((week) => weeks.push([year, 'REG', week]))
    }

    return weeks
}