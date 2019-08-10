import LocalCache from "../cache/cache";

const cache = new LocalCache("../../data/");

test("schedule does not exist", async () => {
  const t = await cache.hasSchedule(2011, "POST", 4);
  expect(t).toEqual(false);
});

test("error id will not exist", async () => {
  const t = await cache.hasGame("somenonsense");
  expect(t).toEqual(false);
});

test("game exists", async () => {
  const t = await cache.hasGame("2018093007");
  expect(t).toEqual(true);
});
