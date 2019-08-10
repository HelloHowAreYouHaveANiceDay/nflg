import LocalCache from "../cache/LocalCache";
import path from "path";
import fs from "fs-extra";

const cache = new LocalCache(path.join(__dirname, "./testCache/"));

describe("schedule tests", () => {
  test("schedule does not exist", async () => {
    const t = await cache.hasSchedule(2011, "POST", 4);
    expect(t).toEqual(false);
  });

  test("save schedule", async () => {
    const s = await fs.readFile(
      path.resolve(__dirname, "./apiResponses/scheduleResponse.xml"),
      "utf-8"
    );
    const f = await cache.saveSchedule(2016, "REG", 17, s);
    const t = await cache.hasSchedule(2016, "REG", 17);
    expect(t).toEqual(true);
  });

  test("read schedule", async () => {
    const s = await fs.readFile(
      path.resolve(__dirname, "./apiResponses/scheduleResponse.xml"),
      "utf-8"
    );
    const t = await cache.readSchedule(2016, "REG", 17);
    expect(t).toEqual(s);
  });

  test("delete schedule", async () => {
    const d = await cache.deleteSchedule(2016, "REG", 17);
    const t = await cache.hasSchedule(2016, "REG", 17);
    expect(t).toEqual(false);
  });
});

describe("game tests", () => {
  const game_id = "2012020500";
  test("error id will not exist", async () => {
    const t = await cache.hasGame("somenonsense");
    expect(t).toEqual(false);
  });

  test("save game", async () => {
    // const game_id = "2012020500";
    const g = await fs.readFile(
      path.resolve(__dirname, "./apiResponses/gameResponse.json"),
      "utf-8"
    );
    await cache.saveGame(game_id, g);
    const t = await cache.hasGame(game_id);
    expect(t).toEqual(true);
  });

  test("read game", async () => {
    const g = await fs.readFile(
      path.resolve(__dirname, "./apiResponses/gameResponse.json"),
      "utf-8"
    );
    const t = await cache.readGame(game_id);
    expect(t).toEqual(g);
  });

  test("delete game", async () => {
    await cache.deleteGame(game_id);
    const t = await cache.hasGame(game_id);
    expect(t).toEqual(false);
  });
});
