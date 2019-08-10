require("dotenv").config();
import { NFLdb } from "../nfldb/NFLdb";
import { getConnectionOptions } from "typeorm";
import path from "path";
import nflGame from "../nflgame/nflgame";
import { Game } from "../Entities/Game";
import { Drive } from "../Entities/Drive";
import Play from "../Entities/Play";

// let nfldb: NFLdb;
const nfldb = new NFLdb();
nflGame.getInstance(process.env.CACHE_PATH);

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

test.skip("get Giants from database", async () => {
  const team = await nfldb.findTeam("NYG");
  expect(team).toEqual({
    team_id: "NYG",
    city: "New York",
    name: "Giants"
  });
});

test.skip("get Texans from database", async () => {
  const team = await nfldb.findTeam("Texans");
  expect(team).toEqual({
    team_id: "HOU",
    city: "Houston",
    name: "Texans"
  });
});

test.skip("get Cowboys from database", async () => {
  const team = await nfldb.findTeam("DAL");
  expect(team).toEqual({
    team_id: "DAL",
    city: "Dallas",
    name: "Cowboys"
  });
});

test.skip("add single game to database", async () => {
  const testId = "2012020500";
  const game = await nfldb.insertSingleGame(testId);

  // check game insertion
  const dbGame = await nfldb.connection
    .createQueryBuilder()
    .select("game")
    .from(Game, "game")
    .where("game.gameid = :id", { id: testId })
    .getRawOne();

  // console.log(dbGame);
  expect(dbGame.game_homeTeamTeamId).toEqual("NE");
  expect(dbGame.game_awayTeamTeamId).toEqual("NYG");

  const dbDrives = await nfldb.connection
    .createQueryBuilder()
    .select("drive")
    .from(Drive, "drive")
    .where("drive.drive_id = :did", { did: "17" })
    .andWhere("drive.game_id = :gid", { gid: testId })
    .getRawOne();

  expect(dbDrives.drive_play_count).toEqual(12);
  expect(dbDrives.drive_result).toEqual("Touchdown");

  const dbPlay = await nfldb.connection
    .createQueryBuilder()
    .select("play")
    .from(Play, "play")
    .where("play.game_id = :game_id", { game_id: testId })
    .andWhere("play.drive_id = :drive_id", { drive_id: "3" })
    .andWhere("Play.play_id = :play_id", { play_id: "500" })
    .getRawOne();

  // console.log(dbPlay);
  expect(dbPlay.play_down).toEqual(2);
  expect(dbPlay.play_yards_to_go).toEqual(8);
}, 50000);
