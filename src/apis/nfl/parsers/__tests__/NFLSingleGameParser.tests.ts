import {
  NFLGamesFromScheduleWeek,
  NFLGameFromSingleGameResponse
} from "../NFLGameParser";

import fs from "fs";
import path from "path";
import { NFLSingleGameResponse } from "../../entities/NFLSingleGameResponse";

test("parse games from schedule", () => {
  const exampleResponse = fs
    .readFileSync(
      path.join(
        __dirname,
        "../../endpoints/__fixtures__/NFLScheduleWeekResponse.xml"
      )
    )
    .toString();

  const parsedGames = NFLGamesFromScheduleWeek(exampleResponse);
  expect(parsedGames.length).toBeGreaterThan(1);
  expect(parsedGames.filter(g => g.game_id === "2019091200").length).toEqual(1);
});

test("parse game from single game", () => {
  const exampleResponse = fs
    .readFileSync(
      path.join(
        __dirname,
        "../../endpoints/__fixtures__/NFLSingleGameSuccessResponse.json"
      )
    )
    .toString();
  const response = JSON.parse(exampleResponse) as NFLSingleGameResponse;

  const parsedGame = NFLGameFromSingleGameResponse(response);
  expect(parsedGame.home_team_id).toEqual("BAL");
  expect(parsedGame.away_team_id).toEqual("GB");
});
