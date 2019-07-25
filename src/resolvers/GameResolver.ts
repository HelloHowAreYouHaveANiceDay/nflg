import "reflect-metadata";
import { Arg, Args, Query, Resolver, FieldResolver, Root } from "type-graphql";

import { gameSearchArgs, Game, scoreDetails } from "../schemas/Game";

import nflGame from "../nflgame/nflgame";

@Resolver(of => Game)
export default class GameResolver {
  @Query(returns => [Game], { nullable: true })
  async games(@Args() input: gameSearchArgs) {
    try {
      const schedule = await nflGame.getInstance().searchSchedule(input);
      return schedule;
    } catch (error) {
      throw error;
    }
  }

  @Query(returns => Game, { nullable: true })
  async game(@Arg("gameid") gameid: string) {
    try {
      const game = await nflGame.getInstance().getSingleGame(gameid);
      return game;
    } catch (err) {
      throw err;
    }
  }

  @FieldResolver()
  async aggregatedGameStats(@Root() game: Game) {
    try {
      const gameDetails = await nflGame
        .getInstance()
        .getAggGameStats(game.gameid);
      return gameDetails;
    } catch (error) {
      throw error;
    }
  }
}
