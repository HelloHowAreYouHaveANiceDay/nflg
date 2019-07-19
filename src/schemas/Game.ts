import { Field, ObjectType } from "type-graphql";

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