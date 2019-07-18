import { ObjectType, Field } from "type-graphql";

@ObjectType()
export default class {
    @Field()
    gameId: number

    @Field()
    driveId: number

    @Field()
    team: string

    @Field()
    def_ast: number

    @Field()
    def_ffum: number

    @Field()
    def_fgblk: number

    @Field()
    def_frec: number
}