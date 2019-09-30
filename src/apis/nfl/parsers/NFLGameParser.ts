import { NFLSingleGameResponse } from "../entities/NFLSingleGameResponse";
import cheerio from "cheerio";
import { NFLGame } from "../entities/NFLGame";
import R from "ramda";

interface NFLGameParser {
  (response: NFLSingleGameResponse): NFLGame;
}

interface NFLGamesParser {
  (response: string): NFLGame[];
}

const tToType = (t: string, gt: string) => {
  if (t == "P" && gt == "PRE") {
    return "PRE";
  } else if (t == "R" && gt == "REG") {
    return "REG";
  }
  return "POST";
};
export const NFLGameFromSingleGameResponse: NFLGameParser = (
  response: NFLSingleGameResponse
) => {
  const keys = Object.keys(response);
  const game_id = R.filter((k: string) => k !== "nextupdate", keys)[0];
  const game = response[game_id];
  const parsedGame: NFLGame = {
    game_id,
    home_team_id: R.path(["home", "abbr"], game),
    away_team_id: R.path(["away", "abbr"], game),
    home_total_score: R.path(["home", "score", "T"], game),
    home_score_q1: R.path(["home", "score", 1], game),
    home_score_q2: R.path(["home", "score", 2], game),
    home_score_q3: R.path(["home", "score", 3], game),
    home_score_q4: R.path(["home", "score", 4], game),
    home_score_q5: R.path(["home", "score", 5], game),
    away_total_score: R.path(["away", "score", "T"], game),
    away_score_q1: R.path(["away", "score", 1], game),
    away_score_q2: R.path(["away", "score", 2], game),
    away_score_q3: R.path(["away", "score", 3], game),
    away_score_q4: R.path(["away", "score", 4], game),
    away_score_q5: R.path(["away", "score", 5], game)
  };

  return parsedGame;
};

export const NFLGamesFromScheduleWeek: NFLGamesParser = (xml: string) => {
  const $ = cheerio.load(xml);

  const parseGame = (i: number, e: CheerioElement) => {
    const gid = $(e).attr("eid");
    return {
      game_id: gid,
      weekday: $(e).attr("d"),
      gsis: +$(e).attr("gsis"),
      year: +$("gms").attr("y"),
      month: +gid.slice(4, 6),
      day: +gid.slice(6, 8),
      time: $(e).attr("t"),
      quarter: $(e).attr("q"),
      game_type: $(e).attr("gt"),
      season_type: tToType($("gms").attr("t"), $(e).attr("gt")),
      week: +$("gms").attr("w"),
      home_team_id: $(e).attr("h"),
      home_team_name: $(e).attr("hnn"),
      home_total_score: +$(e).attr("hs"),
      away_team_id: $(e).attr("v"),
      away_team_name: $(e).attr("vnn"),
      away_total_score: +$(e).attr("vs")
    };
  };

  const games = $("g")
    .map(parseGame)
    .get();

  return games;
};
