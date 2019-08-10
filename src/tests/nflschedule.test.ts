require("dotenv").config();
import Schedule from "../apis/schedule/Schedule";

// test("scheduler", async () => {
//   const homeWeeks = await nflGame
//     .getInstance()
//     .searchSchedule({ year: 2018, seasonType: "REG", home: "NYG" });
//   const awayWeeks = await nflGame
//     .getInstance()
//     .searchSchedule({ year: 2018, seasonType: "REG", away: "NYG" });

//   // there should be 16 games
//   expect(homeWeeks.length + awayWeeks.length).toEqual(16);
// });

test("get current schedule", async () => {
  const currentWeek = await Schedule.getCurrentWeek();
  expect(currentWeek).toBeTruthy();
});

test("calculate a year's nfl schedule", async () => {
  const preseasonGames = Schedule.calculateWeeks(2018, "PRE");
  const regularGames = Schedule.calculateWeeks(2017, "REG");
  const postGames = Schedule.calculateWeeks(2016, "POST");

  // 4 weeks of preseason
  expect(preseasonGames.length).toEqual(4);
  // 17 weeks of regular season
  expect(regularGames.length).toEqual(17);
  // 4 weeks of post season
  expect(postGames.length).toEqual(4);
});
