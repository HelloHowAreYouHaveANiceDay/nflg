import { Field, ObjectType, ID } from "type-graphql";
import AggGameStat from "./AggGameStat";

// ObjectType defines class as a GraphQL type
@ObjectType()
export default class Game{
    @Field(type => ID)
    gameid: string;

    @Field()
    wday: string;

    @Field()
    gsis: string;

    @Field()
    year: number;

    @Field()
    week: number

    @Field()
    month: number;

    @Field()
    day: number;

    @Field()
    time: string;

    @Field()
    quarter: string;

    @Field()
    gameType: string;

    @Field(type => [AggGameStat])
    aggregatedGameStats?: AggGameStat[]
}