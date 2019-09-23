import { NFLSingleGameEndpoint } from "../NFLSingleGameEndpoint";
import NFLSingleGameResponse from "../__fixtures__/NFLSingleGameResponse.json";

const request = {
  get: jest.fn(() => Promise.resolve({ data: "any" }))
};

test("fetches nfl single game endpoint", async () => {
  // setup
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

  const NFLSingleGameRequest = new NFLSingleGameEndpoint(2019081553, request);
  const NFLSGResponse = await NFLSingleGameRequest.execute();
  expect(NFLSGResponse.isSuccess).toEqual(true);
});
