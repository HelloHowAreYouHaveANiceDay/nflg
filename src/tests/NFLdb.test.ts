import { NFLdb } from "../nfldb/NFLdb";

const nfldb = new NFLdb();

beforeAll(async () => {
  await nfldb.setup({
    type: "sqlite",
    database: ":memory:",
    entities: ["../Entities/*.ts"]
  });
  await nfldb.connection.synchronize();
  return await nfldb.setupTeams();
});

test("get team from database", async () => {
  const giants = await nfldb.findTeam("NYG");
  expect(giants).toEqual({
    team_id: "NYG",
    city: "New York",
    name: "Giants"
  });
});
