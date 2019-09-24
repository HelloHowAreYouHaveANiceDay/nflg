import { WebRequest } from "../../../core/WebRequest";
import { Result } from "../../../core/Result";
import { Endpoint } from "../../../core/Endpoint";

export class NFLLiveUpdateWeekEndpoint implements Endpoint {
  url: "https://www.nfl.com/liveupdate/scorestrip/ss.xml";
  game_id: number;

  request: WebRequest;

  constructor(request: WebRequest) {
    this.request = request;
  }

  async execute(): Promise<Result<string>> {
    try {
      const response = await this.request.get(this.url);
      return Result.ok(response.data);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
