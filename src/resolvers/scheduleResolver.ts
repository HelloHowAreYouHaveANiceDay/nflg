import "reflect-metadata";
import path from 'path';
import { Args, ArgsType, Field, Query, Resolver, FieldResolver, Root } from "type-graphql";
import Schedule from '../schemas/Schedule';
import {searchScheduleArgs} from '../schemas/Schedule';

import { nflSchedule } from '../nflgame/schedule/nflSchedule';

@Resolver(of => Schedule)
export default class ScheduleResolver {

    @Query(returns => [Schedule], { nullable: true })
    async searchSchedule(@Args() input: searchScheduleArgs) {
        const fpath = 'c:/working/nflg/data/s_master.json'
        console.log(fpath)
        try {
            const schedule = await nflSchedule.fromFile(fpath);
            return schedule.searchSchedule(input);
        } catch (error) {
            throw error;
        }
    }

    @FieldResolver()
    async game(@Root() schedule: Schedule){
        try {
            console.log(schedule);
            const game = await getGameById(schedule.gameid)
            return game
        } catch (error) {
            return {}
        }
    }
}

