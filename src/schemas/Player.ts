import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export default class Player {
    @Field(type => ID)
    playerId: string

    @Field()
    firstName: string

    @Field()
    lastName: string

    @Field()
    fullName: string

    @Field()
    age: number

    @Field()
    college: string

    @Field()
    // in inches
    height: number

    @Field()
    number: number

    @Field()
    position: string

    @Field()
    gsisId: string;

    @Field()
    profileId: string

    @Field()
    profileUrl: string

    @Field()
    birthDate: string

    @Field()
    birthCity: string

    @Field()
    status?: string

    @Field()
    team: string

    @Field()
    weight: number

    @Field()
    yearsPro?: number
}