import { ObjectType, Field, ID } from "type-graphql";
import Player from "./Player";

@ObjectType()
export default class AggGameStat {
    @Field(type => Player)
    player: Player

    @Field()
    playerId: string

    @Field({nullable: true})
    name: string

    @Field()
    category: string

    @Field({nullable: true})
    passing_att: number

    @Field({nullable: true})
    passing_cmp: number

    @Field({nullable: true})
    passing_yds: number

    @Field({nullable: true})
    passing_ints: number

    @Field({nullable: true})
    passing_twopta: number
}