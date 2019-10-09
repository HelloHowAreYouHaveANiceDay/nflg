import { NFLWeek } from "./values/NFLScheduleWeekParams";
import { WebRequest } from "../../core/WebRequest";
import { NFLLiveUpdateWeekEndpoint } from "./endpoints/NFLLiveUpdateWeekEndpoint";
import { NFLScheduleWeekEndpoint } from "./endpoints/NFLScheduleWeekEndpoint";

export class Schedule {
  liveWeekEndpoint: NFLLiveUpdateWeekEndpoint;

  constructor(request: WebRequest) {
    this.liveWeekEndpoint = new NFLLiveUpdateWeekEndpoint(request);
  }
  async getCurrentWeek(): NFLWeek {
    const weekResponse = await this.liveWeekEndpoint.execute();
    if (weekResponse.isSuccess) {
    }
  }
}
