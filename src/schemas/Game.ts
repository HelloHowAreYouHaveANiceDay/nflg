import { Field, Int, ObjectType } from "type-graphql";

// ObjectType defines class as a GraphQL type
@ObjectType()
export default class Game {
    @Field()
    eid: number;

    //home
    //away
}