import * as cheerio from 'cheerio';
import axios from 'axios';
import fs from 'fs-extra'


const Schedule = require('../data/nflSchedule.json');

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


export function search_schedule(year: number, week?: number, home?: string, away?: string, kind = 'REG', started = false) {
    /*
    Searches the schedule to find the game identifiers matching the criteria
    given.

    The kind parameter specifies whether to fetch preseason, regular season
    or postseason games. Valid values are PRE, REG and POST.
    The week parameter is relative to the value of the kind parameter, and
    may be set to a list of week numbers.

    In the regular season, the week parameter corresponds to the normal
    week numbers 1 through 17. Similarly in the preseason, valid week numbers
    are 1 through 4. In the post season, the week number corresponds to the
    numerical round of the playoffs. So the wild card round is week 1,
    the divisional round is week 2, the conference round is week 3
    and the Super Bowl is week 4.

    The year parameter specifies the season, and not necessarily the actual year that a game was played in. For example, a Super Bowl taking place
    in the year 2011 actually belongs to the 2010 season. Also, the year
    parameter may be set to a list of seasons just like the week parameter.

    If started is True, then only games that have already started (or are
    about to start in less than 5 minutes) will be returned. This is useful when
    you only want to collect stats from games that have JSON data available
    (as opposed to waiting for a 404 error from NFL.com).
    */

    // const infos = []
    // Schedule.games.forEach((game) => {
      
    // })
}

function create_schedule() {
    const day = 60 * 60 * 24

}

export class nflSchedule{
    updateable: false;

    private constructor(schedule){

    }


    async fromFile(filepath: string){
        const fileFound = await fs.
    }
}