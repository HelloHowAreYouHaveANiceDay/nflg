import { Field, ObjectType, ID } from "type-graphql";

// ObjectType defines class as a GraphQL type
@ObjectType()
export default class Game{
    @Field(type => ID)
    eid: number;

    @Field()
    qtr: string;

    @Field()
    redzone: boolean;

}