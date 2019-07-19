import { Field, ObjectType, ID } from "type-graphql";
import AggGameStat from "./AggGameStat";

// ObjectType defines class as a GraphQL type
@ObjectType()
export default class Game{
    @Field(type => ID)
    eid: string;

    @Field()
    qtr: string;

    @Field()
    redzone: boolean;

    @Field(type => [AggGameStat])
    aggregatedGameStats: AggGameStat[]
}