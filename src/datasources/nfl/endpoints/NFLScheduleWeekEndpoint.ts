import { Endpoint } from "../../../core/Endpoint";
import { NFLWeek } from "../values/NFLScheduleWeekParams";
import { Result } from "../../../core/Result";
import { WebRequest } from "../../../core/WebRequest";

export class NFLScheduleWeekEndpoint implements Endpoint {
  url: string;

  request: WebRequest;

  constructor(request: WebRequest, params: nfLWeek) {
    this.url = `https://www.nfl.com/ajax/scorestrip?season=${params.year}&seasonType=${params.type}&week=${params.week}`;
    this.request = request;
  }

  async execute() {
    try {
      const response = await this.request.get(this.url);
      return Result.ok(response.data);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
