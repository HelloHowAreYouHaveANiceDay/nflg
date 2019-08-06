import { NFLdb } from "../nfldb/NFLdb";
import { getConnectionOptions } from "typeorm";
import path from "path";

// let nfldb: NFLdb;
const nfldb = new NFLdb();

beforeAll(async () => {
  // const options = await getConnectionOptions();
  // console.log(options);
  await nfldb.setup();
  await nfldb.connection.synchronize();
  return await nfldb.setupTeams();
});

afterAll(async done => {
  done();
});

test("get Giants from database", async () => {
  const team = await nfldb.findTeam("NYG");
  expect(team).toEqual({
    team_id: "NYG",
    city: "New York",
    name: "Giants"
  });
});

test("get Texans from database", async () => {
  const team = await nfldb.findTeam("Texans");
  expect(team).toEqual({
    team_id: "HOU",
    city: "Houston",
    name: "Texans"
  });
});

test("get Cowboys from database", async () => {
  await nfldb.setupTeams();
  const team = await nfldb.findTeam("DAL");
  expect(team).toEqual({
    team_id: "DAL",
    city: "Dallas",
    name: "Cowboys"
  });
});
