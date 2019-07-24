import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export default class Player {
    @Field(type => ID)
    playerId: string

    @Field({ nullable: true })
    firstName: string

    @Field({ nullable: true })
    lastName: string

    @Field({ nullable: true })
    fullName: string

    @Field({ nullable: true })
    age: number

    @Field({ nullable: true })
    college: string

    @Field({ nullable: true })
    // in inches
    height: number

    @Field({ nullable: true })
    number: number

    @Field({ nullable: true })
    position: string

    @Field()
    gsisId: string;

    @Field()
    profileId: string

    @Field()
    profileUrl: string

    @Field()
    birthDate: string

    @Field({ nullable: true })
    birthCity: string

    @Field({ nullable: true })
    status?: string

    @Field({ nullable: true })
    team: string

    @Field({nullable: true})
    weight: number

    @Field({nullable: true})
    yearsPro?: number
}