import cheerio from "cheerio";
export function parseScheduleResponse(xml: string) {
  const $ = cheerio.load(xml);
  const gameWeek = {
    week: $("gms").attr("w"),
    year: $("gms").attr("y"),
    type: $("gms").attr("t")
  };

  const parseGame = (i: number, e: CheerioElement) => {
    const gid = $(e).attr("eid");
    return {
      game_id: gid,
      weekday: $(e).attr("d"),
      gsis: +$(e).attr("gsis"),
      year: gameWeek.year,
      month: +gid.slice(4, 6),
      day: +gid.slice(6, 8),
      time: $(e).attr("t"),
      quarter: $(e).attr("q"),
      game_type: $(e).attr("gt"),
      season_type: tToType(gameWeek.type, $(e).attr("gt")),
      week: gameWeek.week,
      home_short: $(e).attr("h"),
      home_name: $(e).attr("hnn"),
      home_score: +$(e).attr("hs"),
      away_short: $(e).attr("v"),
      away_name: $(e).attr("vnn"),
      away_score: +$(e).attr("vs")
    };
  };

  const games = $("g")
    .map(parseGame)
    .get();

  return games;
}

const tToType = (t: string, gt: string) => {
  if (t == "P" && gt == "PRE") {
    return "PRE";
  } else if (t == "R" && gt == "REG") {
    return "REG";
  }
  return "POST";
};
