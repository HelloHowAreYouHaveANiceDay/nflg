import { Field, Int, ObjectType } from 'type-graphql';
import Game from './Game';

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
