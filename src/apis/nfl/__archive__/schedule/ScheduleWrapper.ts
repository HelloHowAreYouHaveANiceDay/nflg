import _ from "lodash";
import api from "../../../api";
import {
  parseScheduleResponse,
  getWeekFromScheduleResponse
} from "./parseSchedule";
import LocalCache from "../../../../cache/LocalCache";
import { Game } from "../../../../Entities/Game";

const nflCurrentSchedule = "http://www.nfl.com/liveupdate/scorestrip/ss.xml";

export interface scheduleWeekArgs {
  year: number;
  season_type: string;
  week: number;
}

export default class ScheduleWrapper {
  // games: scheduleGame[];
  cache: LocalCache;

  constructor(cache?: LocalCache) {
    if (cache) {
      this.cache = cache;
    }
  }
  private getScheduleUrl({ year, season_type, week }: scheduleWeekArgs) {
    // Returns the NFL.com XML schedule URL.
    const baseUrl = "https://www.nfl.com/ajax/scorestrip?";
    if (season_type == "POST") {
      week += 17;
      if (week == 21) {
        week += 1;
      }
    }
    return `${baseUrl}season=${year}&seasonType=${season_type}&week=${week}`;
  }

  getWeekGames = async ({
    year,
    season_type,
    week
  }: scheduleWeekArgs): Promise<Game[]> => {
    try {
      if (this.cache) {
        const response = await this.cache.hasSchedule(year, season_type, week);
        if (response) {
          const xml = await this.cache.readSchedule(year, season_type, week);
          return parseScheduleResponse(xml);
        }
      }

      const url = this.getScheduleUrl({ year, season_type, week });
      const response = await api.get(url);

      if (this.cache) {
        await this.cache.saveSchedule(year, season_type, week, response.data);
      }
      // console.log(response.data);
      return parseScheduleResponse(response.data);
    } catch (error) {
      throw error;
    }
  };

  calculateWeeks(year: number, season_type?: string) {
    const weekArgs = (
      year: number,
      season_type: string,
      week: number
    ): scheduleWeekArgs => {
      return {
        year,
        season_type,
        week
      };
    };

    const preseason = _.range(1, 5).map(w => weekArgs(year, "PRE", w));
    const regseason = _.range(1, 18).map(w => weekArgs(year, "REG", w));
    const postseason = _.range(1, 5).map(w => weekArgs(year, "POST", w));

    if (season_type) {
      switch (season_type) {
        case "PRE":
          return preseason;
        case "REG":
          return regseason;
        case "POST":
          return postseason;
        default:
          return [];
      }
    } else {
      return _.concat(preseason, regseason, postseason);
    }
  }

  async getCurrentWeek() {
    try {
      const response = await api.get(nflCurrentSchedule);
      const weeks = getWeekFromScheduleResponse(response.data);
      return weeks;
    } catch (error) {
      throw error;
    }
  }
}
