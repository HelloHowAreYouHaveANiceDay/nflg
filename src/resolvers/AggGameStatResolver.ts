import "reflect-metadata";
import { Resolver, Query, Args, FieldResolver, Root } from "type-graphql";
import { AggGameStat, AggGameStatArgs } from "../schemas/AggGameStat";
import nflGame from "../nflgame/nflgame";
import _ from "lodash";

@Resolver(of => AggGameStat)
export default class AggGameStatResolver {
  @Query(returns => [AggGameStat])
  async getGameStatsByGameId(@Args() params: AggGameStatArgs) {
    if (!params.id) {
      throw new Error("no id passed");
    }
    try {
      let stats = await nflGame.getInstance().getAggGameStats(params.id);
      return stats;
    } catch (err) {
      console.log(err);
    }
  }

  @FieldResolver()
  async player(@Root() stat: AggGameStat) {
    return await nflGame.getInstance().getPlayer(stat.playerId);
  }
}
