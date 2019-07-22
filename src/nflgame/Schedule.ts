import _ from 'lodash';
import { scheduleGame } from './nflApi';

export interface scheduleSearchArgs {
    year?: number;
    week?: number;
    home?: string;
    away?: string;
    season_type?: string;
}

export default class Schedule {
    games: scheduleGame[];

    constructor(games?: scheduleGame[]){

    }

    calculateWeeks(year: number, phase: 'PRE' | 'POST' | 'REG') {
        const weeks: (string | number)[][] = [];
        if (phase == 'POST') {

            _.range(1, 5).forEach((week) => weeks.push([year, 'POST', week]))

        } else if (phase == 'PRE') {

            _.range(0, 5).forEach((week) => weeks.push([year, 'PRE', week]))

        } else {

            _.range(1, 18).forEach((week) => weeks.push([year, 'REG', week]))
        }

        return weeks
    }

}