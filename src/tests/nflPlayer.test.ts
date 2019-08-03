import { parseProfile } from "../nflgame/nflPlayer";
import path from "path";
import fs from "fs-extra";
import Player from "../Entities/Player";

test("parse player profile", async () => {
  const page = await fs.readFile(
    path.join(__dirname, "./profilePage.html"),
    "utf-8"
  );
  const cruz = await fs.readFile(
    path.join(__dirname, "./cruz_profile.html"),
    "utf-8"
  );
  console.log(page.length);
  const willHernandez: Player = {
    firstName: "Will",
    lastName: "Hernandez",
    fullName: "Will Hernandez",
    gsisId: "00-0034346",
    playerId: "HER365408",
    profileId: "2560737",
    profileUrl: "http://www.nfl.com/player/willhernandez/2560737/profile",
    height: 74,
    weight: 327,
    age: 23,
    birthDate: "9/2/1995",
    birthCity: "Las Vegas , NV",
    college: "Texas-El Paso",
    team: "NYG",
    position: "OG",
    number: 71
  };
  const victorCruz: Player = {
    firstName: "Victor",
    lastName: "Cruz",
    fullName: "Victor Cruz",
    gsisId: "00-0027265",
    playerId: "CRU827288",
    profileId: "2507855",
    profileUrl: "http://www.nfl.com/player/victorcruz/2507855/profile",
    height: 72,
    weight: 202,
    age: 32,
    birthDate: "11/11/1986",
    birthCity: "Paterson , NJ",
    college: "Massachusetts",
    team: "",
    position: "",
    number: 0
  };
  expect(parseProfile(cruz)).toEqual(victorCruz);
});
