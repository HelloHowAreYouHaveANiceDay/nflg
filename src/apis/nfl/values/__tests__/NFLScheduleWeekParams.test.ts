import { NFLWeekConstructor, NFLWeek } from "../NFLScheduleWeekParams";
import R from "ramda";

test("NFL Week value", () => {
  const a = new NFLWeek(2019, "PRE", 4);
  const b = new NFLWeek(2019, "PRE", 4);
  const c = new NFLWeek(2019, "REG", 4);
  expect(a.isEqualTo(b)).toEqual(true);
  expect(b.isEqualTo(c)).toEqual(false);
});

test("create valid weeks", () => {
  const pre1 = NFLWeekConstructor.NFLWeekFromParams(2009, "PRE", 1);
  const pre2 = NFLWeekConstructor.NFLWeekFromParams(2009, "PRE", 1);
  const reg = NFLWeekConstructor.NFLWeekFromParams(2019, "REG", 4);
  const post = NFLWeekConstructor.NFLWeekFromParams(2019, "POST", 22);
  const invalid_pre = NFLWeekConstructor.NFLWeekFromParams(2009, "PRE", 5);
  const invalid_reg = NFLWeekConstructor.NFLWeekFromParams(2009, "REG", 0);
  const invalid_post = NFLWeekConstructor.NFLWeekFromParams(2009, "POST", 15);

  expect(pre1.isEqualTo(pre2)).toEqual(true);
  expect(pre2.getValue()).toEqual({
    year: 2009,
    type: "PRE",
    week: 1
  });

  expect(invalid_pre.isValid()).toEqual(false);
  expect(invalid_reg.isValid()).toEqual(false);
  expect(invalid_post.isValid()).toEqual(false);
});

test("create valid year week list", () => {
  const season2018 = NFLWeekConstructor.NFLWeeksFromYear(2018);
  const pre1 = new NFLWeek(2018, "PRE", 1);

  expect(season2018.every(w => w.isValid())).toEqual(true);
  expect(season2018.some(pre1.isEqualTo)).toBeTruthy();
});
