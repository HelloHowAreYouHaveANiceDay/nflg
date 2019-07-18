import * as $ from 'cheerio';
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

function checkMissingWeeks(schedule, year, phase) {

}

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

async function getWeekSchedule(year: number, stype: 'PRE' | 'REG' | 'POST', week: number) {
    const url = getScheduleUrl(year, stype, week);

    try {
        const response = axios.get(url);

    } catch {

    }
}
