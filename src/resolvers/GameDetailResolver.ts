import { Resolver, Query, Arg, Args, FieldResolver, Root } from "type-graphql";
import { AggGameStatArgs, AggGameStat } from "../schemas/AggGameStat";
import _ from "lodash";
import GameDetails from "../schemas/GameDetails";
import nflGame from "../nflgame/nflgame";
// import { getGameById, getGameStats } from '../nflgame/Game'

// @Resolver(of => Game)
// export default class {
//     @Query(returns => Game, { nullable: true })
//     async gameByid(@Arg("eid") eid: number): Promise<any> { }
// // }

// @Resolver(of => GameDetails)
// export class GameDetailsResolver {
//   @Query(returns => GameDetails)
//   async getGameById(@Arg("id") id: string) {
//     const game = await nflGame.getInstance().getGamecenterGame(id);
//     game.eid = id;
//     return game;
//   }

//   @FieldResolver()
//   async aggregatedGameStats(@Root() game: GameDetails) {
//     try {
//       console.log(game.gameid);
//       // @ts-ignore
//       let stats: AggGameStat[] = await nflGame
//         .getInstance()
//         .getAggGameStats(game.gameid);
//       return stats;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }
