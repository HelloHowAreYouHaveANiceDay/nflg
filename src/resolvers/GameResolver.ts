import { Resolver, Query, Arg, FieldResolver, Root } from "type-graphql";
import Game from "../schemas/Game";
import { getGameById, getGameStats } from '../nfl/Game'

// @Resolver(of => Game)
// export default class {
//     @Query(returns => Game, { nullable: true })
//     async gameByid(@Arg("eid") eid: number): Promise<any> { }
// }

@Resolver(of => Game)
export default class {
    @Query(returns => Game)
    async getGameById(@Arg('id') id: number) {
        const game = await getGameById(id);
        game.eid = id;
        return game
    }

    @FieldResolver()
    async aggregatedGameStats(@Root() game: Game) {
        try {
            const stats = await getGameStats(game.eid);
            return stats
        } catch (err) {
            console.log(err)
        }
    }
}