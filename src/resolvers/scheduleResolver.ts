import "reflect-metadata";
import path from 'path';
import { Args, ArgsType, Field, Query, Resolver, FieldResolver, Root } from "type-graphql";
// import Schedule from '../schemas/Schedule';
import {searchScheduleArgs, Schedule} from '../schemas/Schedule';

import { nflSchedule } from '../nflgame/schedule/nflSchedule';
import nflGame from "../nflgame/nflgame";

@Resolver(of => Schedule)
export default class ScheduleResolver {

    @Query(returns => [Schedule], { nullable: true })
    async searchSchedule(@Args() input: searchScheduleArgs) {
        try {
            const schedule = await nflGame.getInstance().searchSchedule(input);
            return schedule;
        } catch (error) {
            throw error;
        }
    }

    @FieldResolver()
    async game(@Root() schedule: Schedule){
        try {
            const game = await nflGame.getInstance().getGame(schedule.gameid)
            return game
        } catch (error) {
            return {}
        }
    }
}

