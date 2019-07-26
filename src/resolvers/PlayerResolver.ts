import { Resolver, Query, Arg, FieldResolver, Root } from "type-graphql";
import Player from "../schemas/Player";
import nflGame from "../nflgame/nflgame";

@Resolver(of => Player)
export default class {
  @Query(returns => Player)
  async Player(@Arg("id") id: string) {
    const p = await nflGame.getInstance().getPlayer(id);
    return p;
  }
}
