import { Resolver, Arg } from "type-graphql";
import Game from "../schemas/Game";

@Resolver(of => Game)
export default class {
    @Query(returns => Game, { nullable: true })
    async gameByid(@Arg("eid") eid: number): Promise<any> { }
}