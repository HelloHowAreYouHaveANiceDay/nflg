import axios from 'axios'
import cheerio from 'cheerio'

interface gameWeekArgs{
    year: number;
    phase: string;
    week: number;
}

export interface scheduleGame {
    gameid: string;
    gsis: string;
    wday: string;
    time: string;
    year: number;
    month: number;
    day: number;
    gameType: string;
    week: number;
    // meridiem: null | string;
    quarter: string;
    homeShort: string;
    homeName: string;
    homeScore: number;
    visitShort: string;
    visitName: string;
    visitScore: number;
}

const nflCurrentSchedule = 'http://www.nfl.com/liveupdate/scorestrip/ss.xml'
const nflCurrentSchedulePostSeason = 'http://www.nfl.com/liveupdate/scorestrip/postseason/ss.xml'

function yearPhaseWeek(year?: number, phase?: string, week?: number) {

}

function currentWeekNumber() {

}

export default class NFLApi {
    static getScheduleUrl(year: number, stype: 'PRE' | 'REG' | 'POST', week: number) {
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

    static async getWeekSchedule(
        year: number,
        stype: 'PRE' | 'REG' | 'POST',
        week: number) {

        const url = this.getScheduleUrl(year, stype, week);

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
                    gameType: stype,
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


    static async currentYearPhaseWeek() {
        const currentSchedule = await axios.get(nflCurrentSchedule)
        const $ = cheerio.load(currentSchedule.data);
        const week: gameWeekArgs = {
            week: +$('gms').attr('w'),
            year: +$('gms').attr('y'),
            phase: 'REG'
        }
        const p = $('gms').attr('t')

        if (p == 'P'){
            week.phase = 'PRE'
        } else if(p == 'POST' || p == 'PRO'){
            week.phase = 'POST'
            week.week -= 17
        } else {
            // phase is REG
        }

        return week;       
    }

    // gets the game detail data from NFL's gamecenter endpoint
    static async getGame(gameid: string) {
        try {
            const url = `https://www.nfl.com/liveupdate/game-center/${gameid}/${gameid}_gtd.json`;
            const response = await axios.get(url)
            return response.data[gameid];
        } catch (err) {
            throw err
        }
    }
}