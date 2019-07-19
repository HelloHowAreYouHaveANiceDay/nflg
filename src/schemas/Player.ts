import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export default class Player {
    @Field(type => ID)
    playerId: string

    @Field()
    firstName: string
}