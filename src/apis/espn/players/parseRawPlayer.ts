import { espnPlayerEntry } from "./espnFantasyPlayers";

export default function parseRawPlayer(player: espnPlayerEntry) {
  const p: {
    [key: string]: any;
  } = {};
  p.espn_player_id = player.id;
  p.active = player.player.active;

  if (player.player.draftRanksByRankType) {
    p.rank_standard = player.player.draftRanksByRankType.STANDARD.rank;
    p.auction_val_standard =
      player.player.draftRanksByRankType.STANDARD.auctionValue;
    p.rank_ppr = player.player.draftRanksByRankType.PPR.rank;
    p.auction_val_ppr = player.player.draftRanksByRankType.PPR.auctionValue;
  }

  p.droppable = player.player.droppable;
  p.first_name = player.player.firstName;
  p.last_name = player.player.lastName;
  p.full_name = player.player.fullName;

  p.number = player.player.jersey;
  p.injured = player.player.injured;
  p.injury_status = player.player.injuryStatus;

  p.own_activity_level = player.player.ownership.activityLevel;
  p.own_auction_val_avg = player.player.ownership.auctionValueAverage;
  p.own_auction_val_avg_change =
    player.player.ownership.auctionValueAverageChange;

  p.own_draft_pos_avg = player.player.ownership.averageDraftPosition;
  p.own_draft_pos_pct_change =
    player.player.ownership.averageDraftPositionPercentageChange;

  p.own_pct = player.player.ownership.percentOwned;
  p.own_pct_changed = player.player.ownership.percentChange;
  p.own_pct_started = player.player.ownership.percentStarted;

  p.pro_team_id = player.player.proTeamId;

  p.pos_rank = player.ratings["0"].positionalRanking;
  p.tot_rank = player.ratings["0"].totalRanking;
  p.tot_rating = player.ratings["0"].totalRating;

  return p;
}
