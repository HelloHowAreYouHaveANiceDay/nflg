import * as cheerio from 'cheerio';
import _ from 'lodash';
import axios from 'axios';
import fs from 'fs-extra'
import { scheduleGame } from './updateSchedule';


// const Schedule = require('../data/nflSchedule.json');

const _range = (start: number, end: number, length = end - start) =>
    Array.from({ length }, (_, i) => start + i)

/**
 * returns an array of year, weekType, week
 * @param year 
 * @param phase 
 */
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

function createSchedule() {

}

interface scheduleQuery {
    year: number;
    week?: number;
    home?: string;
    away?: string;
    gameType?: string;
}

export interface scheduleSearchArgs {
    year?: number;
    week?: number;
    home?: string;
    away?: string;
    season_type?: string;
}

export class nflSchedule {
    lastUpdated: false
    games: scheduleGame[] = []

    private constructor(schedule?: nflSchedule) {
        if(schedule){
            this.games = schedule.games
        }
        // console.log(this.games)
        // update
    }

    public searchSchedule(args: scheduleSearchArgs) {
        const match = args
        console.log(match)
        return _.filter(this.games, match);
    }

    public async saveScheduleToFile(filepath: string) {
        try {
            const data = {
                games: this.games
            }
            const response = await fs.outputJSON(filepath, data)
            return response;
        } catch (error) {
            console.log(error)
        }
    }


    static async fromFile(filepath: string) {
        const exists = await fs.pathExists(filepath);
        if (exists) {
            try {
                const schedule = await fs.readJSON(filepath)
                // const t_s = this.transformFromNFLG(schedule);
                return new nflSchedule(schedule);
            } catch (err) {
                // json read unsuccessful
                console.error(err)
                return new nflSchedule()
            }
        } else {
            // path or file does not exist at all
            console.log('path does not exist')
            return new nflSchedule()
        }
    }

}