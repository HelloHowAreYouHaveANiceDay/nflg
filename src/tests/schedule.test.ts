import path from "path";
import Schedule from "../apis/schedule/Schedule";
import LocalCache from "../cache/LocalCache";

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

describe("schedule tests", () => {
  const cache = new LocalCache(path.join(__dirname, "./testCache/"));
  const schedule = new Schedule(cache);

  test("get current schedule", async () => {
    const currentWeek = await schedule.getCurrentWeek();
    expect(currentWeek).toEqual({
      week: 1,
      season_type: "PRE",
      year: 2019
    });
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
});
