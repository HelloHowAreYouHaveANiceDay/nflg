import { ObjectType, Field } from "type-graphql";

@ObjectType()
export default class {
    @Field()
    id: number

    @Field()
    shortCode: string
}