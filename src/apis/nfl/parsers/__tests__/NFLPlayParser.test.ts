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

  console.log(plays);
  expect(plays).toBeInstanceOf(Array);
});
