import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export default class Schedule {
    @Field()
    gameid: string

    @Field()
    gamekey: string

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
