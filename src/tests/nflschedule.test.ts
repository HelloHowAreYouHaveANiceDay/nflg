require("dotenv").config();
import nflGame from "../nflgame/nflgame";

nflGame.getInstance(process.env.CACHE_PATH);

test("scheduler", async () => {
  const homeWeeks = await nflGame
    .getInstance()
    .searchSchedule({ year: 2018, seasonType: "REG", home: "NYG" });
  const awayWeeks = await nflGame
    .getInstance()
    .searchSchedule({ year: 2018, seasonType: "REG", away: "NYG" });

  // there should be 16 games
  expect(homeWeeks.length + awayWeeks.length).toEqual(16);
});

test("schdule", async () => {
  const allGames = await nflGame.getInstance().searchSchedule({ year: 2017 });

  console.log(allGames.length);
});
