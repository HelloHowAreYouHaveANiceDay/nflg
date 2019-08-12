import GameWrapper from "../apis/game/GameWrapper";
import { nflApiGameResponse } from "../Entities/nflApiGame";

describe("game tests", () => {
  const game = new GameWrapper();
  const game_id = "2012020500";
  // retrieve game from the api
  let nflGame: nflApiGameResponse;
  test("retrieve game from the api", async () => {
    nflGame = await game.getGame(game_id);
    // console.log(findGame);
    expect(nflGame).toHaveProperty(game_id);
  });
  // parse game's drives
  // parse game's plays
  // parse game's players
});
