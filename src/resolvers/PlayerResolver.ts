import { Resolver, Query, Arg, FieldResolver, Root } from "type-graphql";
import Player from "../schemas/Player";
import { getPlayerById } from "../nflgame/nflPlayer";

// @Resolver(of => Game)
// export default class {
//     @Query(returns => Game, { nullable: true })
//     async gameByid(@Arg("eid") eid: number): Promise<any> { }
// }

@Resolver(of => Player)
export default class {
    @Query(returns => Player)
    async Player(@Arg('id') id: string) {
        const p = await getPlayerById(id);
        return p
    }

}