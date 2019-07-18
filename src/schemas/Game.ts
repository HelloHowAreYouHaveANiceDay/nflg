import { Field, Int, ObjectType } from "type-graphql";
import { nflPlayerStat } from '../nfl/Game'

// ObjectType defines class as a GraphQL type
@ObjectType()
export default class {
    @Field()
    eid: number;

    @Field()
    qtr: string;

    @Field()
    redzone: boolean;

}