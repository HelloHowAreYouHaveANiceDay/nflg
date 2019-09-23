import { NFLSingleGameEndpoint } from "../NFLSingleGameEndpoint";
import NFLSingleGameResponse from "../__fixtures__/NFLSingleGameSuccessResponse.json";
import { request } from "../../../__mocks__/MockRequest";

import fs from "fs";
import path from "path";

const example404Response = fs
  .readFileSync(
    path.join(__dirname, "../__fixtures__/NFLSingleGameFailResponse.html")
  )
  .toString();

test("successfully fetches nfl single game endpoint", async () => {
  // setup
  request.get.mockClear();
  request.get.mockImplementationOnce(() =>
    Promise.resolve({
      headers: {
        Server: "Apache",
        "Last-Modified": "Fri, 23 Aug 2019 18:55:06 GMT",
        Etag: '"1dde1-590cd5834224d"',
        "Accept-Ranges": "bytes",
        "Content-Length": 17180,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Content-Encoding": "gzip",
        "Cache-Control": "max-age=10",
        // Expires: "four hours from current time"
        // Date: "four hours from current time"
        Connection: "keep-alive",
        Vary: "Accept-Encoding",
        "X-Akamai-Edgescape": "country_code=US"
      },
      data: JSON.stringify(NFLSingleGameResponse),
      status: 200,
      statusText: "OK"
    })
  );
  const game_id = 2019081553;

  // request
  const NFLSingleGameRequest = new NFLSingleGameEndpoint(request, game_id);
  const NFLSGResponse = await NFLSingleGameRequest.execute();

  // verification
  expect(NFLSGResponse.isSuccess).toEqual(true);
  expect(request.get).toBeCalledTimes(1);
  expect(request.get).toBeCalledWith(
    `https://www.nfl.com/liveupdate/game-center/${game_id}/${game_id}_gtd.json`
  );
});

test("unsuccessful request returns false", async () => {
  request.get.mockClear();
  request.get.mockImplementationOnce(() =>
    Promise.reject({
      response: {
        status: 404,
        statusText: "Not Found",
        data: example404Response
      }
    })
  );

  const game_id = 2022081553;

  // request
  const NFLSingleGameRequest = new NFLSingleGameEndpoint(request, game_id);
  const NFLSGResponse = await NFLSingleGameRequest.execute();

  // verification
  expect(NFLSGResponse.isFailure).toEqual(true);
  expect(request.get).toBeCalledTimes(1);
  expect(request.get).toBeCalledWith(
    `https://www.nfl.com/liveupdate/game-center/${game_id}/${game_id}_gtd.json`
  );
});
