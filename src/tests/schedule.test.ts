import ScheduleWrapper from "../apis/schedule/ScheduleWrapper";

describe("schedule tests", () => {
  const schedule = new ScheduleWrapper();

  test("get current schedule", async () => {
    const currentWeek = await schedule.getCurrentWeek();
    expect(currentWeek).toEqual({
      week: 2,
      season_type: "PRE",
      year: 2019
    });
  });

  test("calculate a year's nfl schedule", async () => {
    const preseasonGames = schedule.calculateWeeks(2018, "PRE");
    const regularGames = schedule.calculateWeeks(2017, "REG");
    const postGames = schedule.calculateWeeks(2016, "POST");

    // 4 weeks of preseason
    expect(preseasonGames.length).toEqual(4);
    // 17 weeks of regular season
    expect(regularGames.length).toEqual(17);
    // 4 weeks of post season
    expect(postGames.length).toEqual(4);
  });

  test("get a week's game", async () => {
    const games = await schedule.getWeekGames({
      year: 2014,
      season_type: "REG",
      week: 4
    });
    expect(games.length).toEqual(13);
  });

  test("get a sb game", async () => {
    const games = await schedule.getWeekGames({
      year: 2011,
      season_type: "POST",
      week: 4
    });
    expect(games.length).toEqual(1);
  });
});
