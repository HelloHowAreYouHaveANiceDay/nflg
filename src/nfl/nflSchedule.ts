import * as cheerio from 'cheerio';
import axios from 'axios';


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

// function checkMissingWeeks(schedule, year, phase) {

// }

function getScheduleUrl(year: number, stype: 'PRE' | 'REG' | 'POST', week: number) {
    // Returns the NFL.com XML schedule URL. 

    const baseUrl = 'https://www.nfl.com/ajax/scorestrip?'

    if (stype == 'POST') {
        week += 17
        if (week == 21) {
            week += 1
        }
    }

    return `${baseUrl}season=${year}&seasonType=${stype}&week=${week}`
}

interface scheduleGame {
    gameid: string,
    gsis: string,
    wday: string,
    time: string,
    year: number,
    month: number,
    day: number,
    seasonType: string,
    week: number,
    // meridiem: null | string,
    quarter: string,
    homeShort: string,
    homeName: string,
    homeScore: number,
    visitShort: string,
    visitName: string,
    visitScore: number,
}

export async function getWeekSchedule(year: number, stype: 'PRE' | 'REG' | 'POST', week: number) {
    const url = getScheduleUrl(year, stype, week);

    try {
        const response = await axios.get(url);
        const xml = response.data;
        const $ = cheerio.load(xml)
        const games: scheduleGame[] = []
        // game schedule is returned from the score strip as xml
        // each <g> represents a game.
        $('g').each((i, e) => {
            const gid = $(e).attr('eid')
            games[i] = {
                gameid: gid,
                wday: $(e).attr('d'),
                gsis: $(e).attr('gsis'),
                year,
                month: +gid.slice(4, 6),
                day: +gid.slice(6, 8),
                time: $(e).attr('t'),
                quarter: $(e).attr('q'),
                seasonType: stype,
                week: week,
                homeShort: $(e).attr('h'),
                homeName: $(e).attr('hnn'),
                homeScore: +$(e).attr('hs'),
                visitShort: $(e).attr('v'),
                visitName: $(e).attr('vnn'),
                visitScore: +$(e).attr('vs'),
            }
        })
        // console.log(games)
        return games
    } catch (err) {
        throw err;
    }
}

// TODO: update schedule function

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

    const infos = []

}

function create_schedule(){
    const day = 60 * 60 * 24
    
}