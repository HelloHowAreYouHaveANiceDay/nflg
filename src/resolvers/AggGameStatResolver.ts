import { Resolver, Query, Arg, FieldResolver, Root } from "type-graphql";
import AggGameStat from "../schemas/AggGameStat";
import nflGame from "../nflgame/nflgame";
// import { getGameStats } from "../nflgame/Game";
// import { getPlayerById } from "../nflgame/nflPlayer";

@Resolver(of => AggGameStat)
export default class {
    @Query(returns => [AggGameStat])
    async getGameStatsByGameId(@Arg('id') id: string) {
        try {
            const stats = await nflGame.getInstance().getAggGameStats(id);
            return stats
        } catch (err) {
            console.log(err)
        }
    }

    @FieldResolver()
    async player(@Root() stat: AggGameStat){
        return await nflGame.getInstance().getPlayer(stat.playerId)
    }
}