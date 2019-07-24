import { ObjectType, Field, ID } from "type-graphql";
import Player from "./Player";
import { fromNumber } from "long";

@ObjectType()
export default class AggGameStat {
    @Field(type => Player)
    player: Player

    @Field(type => ID)
    playerId: string

    @Field()
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
    passing_twopta?: number

    @Field({nullable: true})
    passing_twoptm?: number

    @Field({nullable: true})
    rushing_att?: number

    @Field({nullable: true})
    rushing_yds?: number

    @Field({nullable: true})
    rushing_tds?: number

    @Field({nullable: true})
    rushing_lng?: number

    @Field({nullable: true})
    rushing_lngtd?: number

    @Field({nullable: true})
    rushing_twopta?: number

    @Field({nullable: true})
    rushing_twoptm?: number

    @Field({nullable: true})
    receiving_rec?: number

    @Field({nullable: true})
    receiving_yds?: number

    @Field({nullable: true})
    receiving_tds?: number

    @Field({nullable: true})
    receiving_lng?: number

    @Field({nullable: true})
    receiving_lngtd?: number

    @Field({nullable: true})
    receiving_twopta?: number

    @Field({nullable: true})
    receiving_twoptm?: number

    @Field({nullable: true})
    fumbles_forced?: number

    @Field({nullable: true})
    fumbles_lost?: number

    @Field({nullable: true})
    fumbles_notforced?: number

    @Field({nullable: true})
    fumbles_oob?: number

    @Field({nullable: true})
    fumbles_rec_yds?: number

    @Field({nullable: true})
    fumbles_tot?: number

    @Field({nullable: true})
    fumbles_rec_tds?: number

    @Field({nullable: true})
    kicking_fgm?: number

    @Field({nullable: true})
    kicking_fga?: number

    @Field({nullable: true})
    kicking_fgyds?: number

    @Field({nullable: true})
    kicking_totpfg?: number

    @Field({nullable: true})
    kicking_xpmade?: number

    @Field({nullable: true})
    kicking_xpa?: number

    @Field({nullable: true})
    kicking_xpb?: number

    @Field({nullable: true})
    kicking_xptot?: number

    @Field({nullable: true})
    punting_pts?: number

    @Field({nullable: true})
    punting_yds?: number

    @Field({nullable: true})
    punting_avg?: number

    @Field({nullable: true})
    punting_i20?: number

    @Field({nullable: true})
    punting_lng?: number

    @Field({nullable: true})
    kickret_ret?: number

    @Field({nullable: true})
    kickret_avg?: number

    @Field({nullable: true})
    kickret_tds?: number

    @Field({nullable: true})
    kickret_lng?: number

    @Field({nullable: true})
    kickret_lngtd?: number

    @Field({nullable: true})
    puntret_ret?: number

    @Field({nullable: true})
    puntret_avg?: number

    @Field({nullable: true})
    puntret_tds?: number

    @Field({nullable: true})
    puntret_lng?: number

    @Field({nullable: true})
    puntret_lngtd?: number

    @Field({nullable: true})
    defense_tkl?: number

    @Field({nullable: true})
    defense_ast?: number

    @Field({nullable: true})
    defense_int?: number

    @Field({nullable: true})
    defense_ffum?: number
}