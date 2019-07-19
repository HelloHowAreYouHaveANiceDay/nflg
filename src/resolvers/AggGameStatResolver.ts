import { Resolver, Query, Arg } from "type-graphql";
import AggGameStat from "../schemas/AggGameStat";
import { getGameStats } from "../nfl/Game";

@Resolver(AggGameStat)
export default class {
    @Query(returns => [AggGameStat])
    async getGameStatsByGameId(@Arg('id') id: number) {
        try {
            const stats = await getGameStats(id);
            return stats
        } catch (err) {
            console.log(err)
        }
    }
}