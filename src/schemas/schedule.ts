import { ArgsType, Field, Int, ObjectType } from 'type-graphql';
import Game from './Game';

@ArgsType()
export class searchScheduleArgs {

    @Field({ nullable: true })
    year?: number;

    @Field({ nullable: true })
    week?: number;

    @Field({ nullable: true })
    home?: string;

    @Field({ nullable: true })
    away?: string;

    @Field({ nullable: true })
    season_type?: string;
}

@ObjectType()
export class Schedule {
    @Field()
    gameid: string

    // @Field()
    // gamekey: string

    @Field()
    gsis: number

    @Field(type => Game)
    game?: Game

    // @Field()
    // home: string

    // @Field()
    // away: string

    @Field()
    month: number;

    @Field()
    quarter: string;

    @Field()
    week: number;

    @Field()
    gameType: string

    @Field()
    homeShort: string

    @Field()
    homeName: string;

    @Field()
    homeScore: number;

    @Field()
    awayShort: string;

    @Field()
    awayName: string;

    @Field()
    awayScore: number;

    @Field()
    time: string

    @Field()
    day: number

    @Field()
    wday: string

    // @Field()
    // week: string

    @Field()
    year: number
}
