import "reflect-metadata";
import { Args, Query, Resolver, FieldResolver, Root } from "type-graphql";

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

  //   @FieldResolver()
  //   async homeScoreDetails(@Root() game: Game): Promise<scoreDetails> {
  //     const gameDetails = await nflGame.getInstance().getGame(game.gameid);
  //     return gameDetails.home.score;
  //   }
}
