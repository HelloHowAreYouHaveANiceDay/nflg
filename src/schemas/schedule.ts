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
export default class Schedule {
    @Field()
    gameid: string

    @Field()
    gamekey: string

    @Field(type => Game)
    game: Game

    @Field()
    home: string

    @Field()
    away: string

    @Field()
    time: string

    @Field()
    day: number

    @Field()
    wday: string

    @Field()
    week: string

    @Field()
    year: number
}
