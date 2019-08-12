import path from "path";
import GameWrapper from "../apis/game/GameWrapper";
import LocalCache from "../cache/LocalCache";
import { nflApiGameResponse } from "../Entities/nflApiGame";
import _ from "lodash";

const cache = new LocalCache(path.join(__dirname, "./testCache/"));

describe("game tests", () => {
  const game = new GameWrapper(cache);
  const game_id = "2012020500";
  // retrieve game from the api
  let nflGame: nflApiGameResponse;
  beforeAll(async () => {
    nflGame = await game.getGame(game_id);
  });

  test("retrieve game from the api", async () => {
    // console.log(findGame);
    expect(nflGame).toHaveProperty(game_id);
  });
  // parse game's drives
  test("parse game's drives", () => {
    const drives = game.parseDrives(nflGame);
    //@ts-ignore
    expect(drives.length).toEqual(nflGame[game_id].drives.crntdrv);
  });
  // parse game's plays
  test("parse plays", () => {
    const plays = game.parsePlays(nflGame);
    expect(plays).toBeInstanceOf(Array);
    expect(plays).toBeTruthy();
  });
  // parse game's playPlayers
  test("parse playPlayers", () => {
    const pp = game.parsePlayPlayers(nflGame);
    // console.log(_.filter(pp, { player_id: "NYG" }));
    expect(pp).toBeInstanceOf(Array);
  });
  // parse game's players
});
