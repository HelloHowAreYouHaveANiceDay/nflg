import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export default class Player {
    @Field(type => ID)
    playerId: string

    @Field()
    first_name: string

    @Field()
    last_name: string

    @Field()
    full_name: string

    @Field()
    college: string

    @Field()
    height: number

    @Field()
    number: number

    @Field()
    position: string

    @Field()
    profile_id: number

    @Field()
    profile_url: string

    @Field()
    status: string

    @Field()
    team: string

    @Field()
    weight: number

    @Field()
    years_pro: number
}