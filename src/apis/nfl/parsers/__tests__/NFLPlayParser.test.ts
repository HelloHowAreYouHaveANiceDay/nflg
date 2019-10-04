import { NFLPlaysFromSingleGameResponse } from "../NFLPlayParser";

const fs = require("fs");
const path = require("path");

test("plays from single game response", () => {
  const exampleResponse = fs
    .readFileSync(
      path.join(
        __dirname,
        "../../endpoints/__fixtures__/NFLSingleGameSuccessResponse.json"
      )
    )
    .toString();

  const ex = JSON.parse(exampleResponse);
  const plays = NFLPlaysFromSingleGameResponse(ex);

  expect(plays).toBeInstanceOf(Array);
  expect(plays[0].game_id).toEqual("2019081553");
});
