import { Resolver, Query, Arg } from "type-graphql";
import Game from "../schemas/Game";
import { getGameById } from '../nfl/Game'

// @Resolver(of => Game)
// export default class {
//     @Query(returns => Game, { nullable: true })
//     async gameByid(@Arg("eid") eid: number): Promise<any> { }
// }

@Resolver()
export default class {
    @Query(returns => Game)
    async getGameById(@Arg('id') id: number) {
        const game = await getGameById(id);
        game.eid = id;
        return game
    }
}