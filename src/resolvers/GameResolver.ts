import { Resolver, Query, Arg, FieldResolver, Root } from "type-graphql";
import Game from "../schemas/Game";
import nflGame from "../nflgame/nflgame";
// import { getGameById, getGameStats } from '../nflgame/Game'

// @Resolver(of => Game)
// export default class {
//     @Query(returns => Game, { nullable: true })
//     async gameByid(@Arg("eid") eid: number): Promise<any> { }
// }

@Resolver(of => Game)
export default class {
    @Query(returns => Game)
    async getGameById(@Arg('id') id: string) {
        const game = await nflGame.getInstance().getGamecenterGame(id);
        game.eid = id;
        return game
    }

    @FieldResolver()
    async aggregatedGameStats(@Root() game: Game) {
        try {
            console.log(game.gameid);
            const stats = await nflGame.getInstance().getAggGameStats(game.gameid);
            return stats
        } catch (err) {
            console.log(err)
        }
    }
}