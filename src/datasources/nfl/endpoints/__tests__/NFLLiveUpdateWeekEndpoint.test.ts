import { NFLLiveUpdateWeekEndpoint } from "../NFLLiveUpdateWeekEndpoint";
import { request } from "../../../__mocks__/MockRequest";

const fs = require("fs");
const path = require("path");

const exampleResponse = fs
  .readFileSync(
    path.join(__dirname, "../__fixtures__/NFLLiveUpdateWeekResponse.xml")
  )
  .toString();

test("success fetch of schedule week", async () => {
  // setup
  request.get.mockImplementationOnce(() =>
    Promise.resolve({
      headers: {
        Server: "Apache",
        "Content-Type": "text/xml;charset=ISO-8859-1",
        "Last-Modified": "Tue, 24 Sep 2019 13:31:30 GMT",
        ETag: '"955-5934c8dd8d384"',
        "Accept-Ranges": "bytes",
        "Content-Length": 687,
        "Access-Control-Allow-Origin": "*",
        "Content-Encoding": "gzip",
        "Cache-Control": "max-age=9",
        //   "Expires": 3 hours after timestamp
        // "Date": 3 hours after timestamp
        Connection: "keep-alive",
        Vary: "Accept-Encoding",
        "X-Akamai-Edgescape": "country_code=US"
      },
      data: exampleResponse.toString(),
      status: 200,
      statusText: "OK"
    })
  );

  // request
  const req = new NFLLiveUpdateWeekEndpoint(request);
  const response = await req.execute();

  // verification
  expect(response.isSuccess).toBe(true);
  expect(request.get).toBeCalledTimes(1);
});
