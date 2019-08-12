import _ from "lodash";
import api from "../api";
import {
  parseScheduleResponse,
  getWeekFromScheduleResponse
} from "./parseSchedule";
import LocalCache from "../../cache/LocalCache";

const nflCurrentSchedule = "http://www.nfl.com/liveupdate/scorestrip/ss.xml";

interface scheduleWeekArgs {
  year: number;
  season_type: string;
  week: number;
}

export default class ScheduleWrapper {
  // games: scheduleGame[];
  cache: LocalCache | null = null;

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

  async getWeekGames({ year, season_type, week }: scheduleWeekArgs) {
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

      return parseScheduleResponse(response.data);
    } catch (error) {
      throw error;
    }
  }

  calculateWeeks(year: number, season_type: "PRE" | "POST" | "REG") {
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

    switch (season_type) {
      case "PRE":
        return _.range(1, 5).map(w => weekArgs(year, "PRE", w));
      case "REG":
        return _.range(1, 18).map(w => weekArgs(year, "REG", w));
      case "POST":
        return _.filter(
          _.range(1, 5).map(w => weekArgs(year, "REG", w))
          // a => a.week != 21
        );
      default:
        return [];
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
