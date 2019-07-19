import { ObjectType, Field } from "type-graphql";

@ObjectType()
export default class {
    @Field()
    playerId: string

    @Field()
    name: string

    @Field()
    category: string

    @Field()
    passing_att: number

    @Field()
    passing_cmp: number

    @Field()
    passing_yds: number

    @Field()
    passing_ints: number

    @Field()
    passing_twopta: number
}