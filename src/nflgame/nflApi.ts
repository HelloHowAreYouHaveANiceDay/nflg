import axios from "./api";
import cheerio from "cheerio";
import _ from "lodash";

interface gameWeekArgs {
  year: number;
  stype: string;
  week: number;
}

export interface scheduleGame {
  gameid: string;
  // gsis: string;
  wday: string;
  time: string;
  year: number;
  month: number;
  day: number;
  seasonType: string;
  gameType: string;
  week: number;
  // meridiem: null | string;
  quarter: string;
  homeShort: string;
  homeName: string;
  homeScore: number;
  awayShort: string;
  awayName: string;
  awayScore: number;
}

const nflCurrentSchedule = "http://www.nfl.com/liveupdate/scorestrip/ss.xml";
// const nflCurrentSchedulePostSeason =
// "http://www.nfl.com/liveupdate/scorestrip/postseason/ss.xml";
const nflRosterUrl = "http://www.nfl.com/teams/roster?team=";
// const nflProfileUrl = "http://www.nfl.com/players/profile?id=";

export default class NFLApi {
  static async yearPhaseWeek(week?: gameWeekArgs) {
    let currentWeek: gameWeekArgs;
    if (!week) {
      currentWeek = await NFLApi.currentYearPhaseWeek();
    } else {
      currentWeek = week;
    }

    const nflYear = [
      ["PRE", 0],
      ["PRE", 1],
      ["PRE", 2],
      ["PRE", 3],
      ["PRE", 4],
      ["PRE", 5],
      ["REG", 1],
      ["REG", 2],
      ["REG", 3],
      ["REG", 4],
      ["REG", 5],
      ["REG", 6],
      ["REG", 7],
      ["REG", 8],
      ["REG", 9],
      ["REG", 10],
      ["REG", 11],
      ["REG", 12],
      ["REG", 13],
      ["REG", 14],
      ["REG", 15],
      ["REG", 16],
      ["REG", 17],
      ["REG", 18],
      ["POST", 1],
      ["POST", 2],
      ["POST", 3],
      ["POST", 4],
      ["POST", 5]
    ];

    const scheduleWeeks: gameWeekArgs[] = [];

    // There should be a better way to write this
    // 1. generate all the weeks up to the current year
    const mapWeeks = _.map(
      _.range(2009, currentWeek.year + 1),
      // 2. generate based on the list of season games
      y =>
        nflYear.map(w => {
          return {
            year: y,
            week: +w[1],
            stype: w[0].toString()
          };
        })
    );

    // 3. flatten the array
    const allWeeks = _.flatten(mapWeeks);

    // 4. run through the generated weeks up to the current week
    for (let i = 0; i < allWeeks.length; i++) {
      scheduleWeeks.push(allWeeks[i]);

      // stop once it is a current week
      if (
        allWeeks[i].year == currentWeek.year &&
        allWeeks[i].week == currentWeek.week &&
        allWeeks[i].stype == currentWeek.stype
      ) {
        i = allWeeks.length;
      }
    }

    return _.reverse(scheduleWeeks);
  }

  static getScheduleUrl(year: number, stype: string, week: number) {
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

  static getWeekSchedule = async (params: gameWeekArgs) => {
    const url = NFLApi.getScheduleUrl(params.year, params.stype, params.week);

    try {
      const response = await axios.get(url);
      const xml = response.data;
      const $ = cheerio.load(xml);
      const games: scheduleGame[] = [];
      // game schedule is returned from the score strip as xml
      // each <g> represents a game.
      $("g").each((i, e) => {
        const gid = $(e).attr("eid");
        games[i] = {
          gameid: gid,
          wday: $(e).attr("d"),
          // gsis: +$(e).attr("gsis"),
          year: params.year,
          month: +gid.slice(4, 6),
          day: +gid.slice(6, 8),
          time: $(e).attr("t"),
          quarter: $(e).attr("q"),
          gameType: $(e).attr("gt"),
          seasonType: tToType($("gms").attr("t"), $(e).attr("gt")),
          week: params.week,
          homeShort: $(e).attr("h"),
          homeName: $(e).attr("hnn"),
          homeScore: +$(e).attr("hs"),
          awayShort: $(e).attr("v"),
          awayName: $(e).attr("vnn"),
          awayScore: +$(e).attr("vs")
        };
      });
      // console.log(games)
      return games;
    } catch (err) {
      throw err;
    }
  };

  static async currentYearPhaseWeek() {
    const currentSchedule = await axios.get(nflCurrentSchedule);
    const $ = cheerio.load(currentSchedule.data);
    const week: gameWeekArgs = {
      week: +$("gms").attr("w"),
      year: +$("gms").attr("y"),
      stype: "REG"
    };
    const p = $("gms").attr("t");

    if (p == "P") {
      week.stype = "PRE";
    } else if (p == "POST" || p == "PRO") {
      week.stype = "POST";
      week.week -= 17;
    } else {
      // phase is REG
    }

    return week;
  }

  // gets the game detail data from NFL's gamecenter endpoint
  static async getGame(gameid: string) {
    try {
      const url = `https://www.nfl.com/liveupdate/game-center/${gameid}/${gameid}_gtd.json`;
      const response = await axios.get(url);
      return response.data[gameid];
    } catch (err) {
      throw err;
    }
  }

  static async rosterParser(rawRoster: string) {
    const $ = cheerio.load(rawRoster);
    const evens = $("tr[class=even]");
    const odds = $("tr[class=odd]");
    const players: any[] = [];
    //@ts-ignore
    const addPlayer = (index, element) => {
      const meta = $(element).children();
      const player: any = {};
      meta.each((i, e) => {
        switch (i) {
          case 0:
            player.number = $(e).text();
            break;
          case 1:
            const name = $(e)
              .children()
              .first()
              .text()
              .trim();
            if (name.includes(",")) {
              player.lastName = name.split(",")[0];
              player.firstName = name.split(",")[1];
            } else {
              player.lastName = name;
              player.firstName = "";
            }
            player.profileUrl = $(e)
              .children()
              .first()
              .attr("href");
            player.playerid = profileIdFromUrl(player.profileUrl);
            break;
          case 2:
            player.position = $(e).text();
            break;
          case 3:
            player.status = $(e).text();
            break;
          case 4:
            player.height = $(e).text();
            break;
          case 5:
            player.weight = $(e).text();
            break;
          case 6:
            player.birthdate = $(e).text();
            break;
          case 7:
            player.yexp = $(e).text();
            break;
          case 8:
            player.college = $(e).text();
          default:
            break;
        }
      });
      players.push(player);
    };

    evens.each(addPlayer);
    odds.each(addPlayer);
    return players;
    // return _.concat(evens, odds);
  }

  static async getRoster(team: string) {
    try {
      const url = nflRosterUrl + team;
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getPlayerProfile(gsisId: string) {
    const response = await axios.get(
      `https://www.nfl.com/players/profile?id=${gsisId}`
    );
    return response.data;
  }
}

function profileIdFromUrl(url: string) {
  return url.match(/([0-9]+)/)![0];
}

const tToType = (t: string, gt: string) => {
  if (t == "P" && gt == "PRE") {
    return "PRE";
  } else if (t == "R" && gt == "REG") {
    return "REG";
  }
  return "POST";
};
