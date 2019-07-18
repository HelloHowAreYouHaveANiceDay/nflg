import * as cheerio from 'cheerio';
import axios from 'axios';

const _range = (start: number, end: number, length = end - start) =>
    Array.from({ length }, (_, i) => start + i)

/**
 * returns an array of year, weekType, week
 * @param year 
 * @param phase 
 */
function getWeeksByYearPhase(year: number, phase: 'PRE' | 'POST' | 'REG') {
    const weeks: (string | number)[][] = [];

    _range(0, 5).forEach((week) => weeks.push([year, 'PRE', week]))
    _range(1, 18).forEach((week) => weeks.push([year, 'REG', week]))

    if (phase == 'POST') {
        _range(1, 5).forEach((week) => weeks.push([year, 'POST', week]))
    }

    return weeks
}

// function checkMissingWeeks(schedule, year, phase) {

// }

function getScheduleUrl(year: number, stype: 'PRE' | 'REG' | 'POST', week: number) {
    // Returns the NFL.com XML schedule URL. 

    const baseUrl = 'https://www.nfl.com/ajax/scorestrip?'

    if(stype == 'POST') {
        week += 17
        if(week == 21) {
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
                month: +gid.slice(4,6),
                day: +gid.slice(6,8),
                time: $(e).attr('t'),
                quarter: $(e).attr('q'),
                seasonType: stype,
                meridiem: null,
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
    } catch (err){
        throw err;
    }
}