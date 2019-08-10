import _ from "lodash";
import api from "../api";
import { parseScheduleResponse } from "./parseSchedule";

const nflCurrentSchedule = "http://www.nfl.com/liveupdate/scorestrip/ss.xml";

export default class Schedule {
  // games: scheduleGame[];

  // constructor(games?: scheduleGame[]) {}
  private static getScheduleUrl(year: number, stype: string, week: number) {
    // Returns the NFL.com XML schedule URL.
    const baseUrl = "https://www.nfl.com/ajax/scorestrip?";
    if (stype == "POST") {
      week += 17;
      if (week == 21) {
        week += 1;
      }
    }
    return `${baseUrl}season=${year}&seasonType=${stype}&week=${week}`;
  }

  static async getHistoricWeek(
    year: number,
    season_type: string,
    week: number
  ) {
    const url = this.getScheduleUrl(year, season_type, week);
    const response = await api.get(url);
  }

  static calculateWeeks(year: number, season_type: "PRE" | "POST" | "REG") {
    const weekArgs = (year: number, season_type: string, week: number) => {
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
          _.range(18, 23).map(w => weekArgs(year, "REG", w)),
          a => a.week != 21
        );
      default:
        return [];
    }
  }

  static async getCurrentWeek() {
    try {
      const response = await api.get(nflCurrentSchedule);
      const weeks = parseScheduleResponse(response.data);
      // console.log(weeks);
      return weeks;
    } catch (error) {
      throw error;
    }
  }
}
