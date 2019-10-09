import { NFLScheduleWeekEndpoint } from "../NFLScheduleWeekEndpoint";
import { request } from "../../../__mocks__/MockRequest";

const fs = require("fs");
const path = require("path");

const exampleResponse = fs
  .readFileSync(
    path.join(__dirname, "../__fixtures__/NFLScheduleWeekResponse.xml")
  )
  .toString();

test("success fetch of schedule week", async () => {
  // setup
  request.get.mockImplementationOnce(() =>
    Promise.resolve({
      headers: {
        Server: "Apache",
        "Content-Type": "text/xml;charset=ISO-8859-1",
        "Content-Language": "en-US",
        "Content-Length": 689,
        "Access-Control-Allow-Origin": "*",
        "Content-Encoding": "gzip",
        "Cache-Control": "max-age=102",
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
  const NFLScheduleWeekRequest = new NFLScheduleWeekEndpoint(request, {
    year: 2019,
    type: "REG",
    week: 2
  });
  const NFLSWResponse = await NFLScheduleWeekRequest.execute();

  // verification
  expect(NFLSWResponse.isSuccess).toBe(true);
  expect(request.get).toBeCalledTimes(1);
});
