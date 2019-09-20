import _ from "lodash";
import { nflTeamIdToNFLTeamAbbreviation } from "../espnConstants";
import { EspnPlayerEntry } from "./espnFantasyPlayers";
import EspnPlayer from "../../../Entities/EspnPlayer";
import R from "ramda";

export default function parseRawPlayer(player: EspnPlayerEntry) {
  try {
    //@ts-ignore
    const p: EspnPlayer = {};

    p.espn_player_id = player.id;
    p.active = player.player.active;

    if (player.player.draftRanksByRankType) {
      if (player.player.draftRanksByRankType.STANDARD) {
        p.rank_standard = player.player.draftRanksByRankType.STANDARD.rank;
        p.auc_val_standard =
          player.player.draftRanksByRankType.STANDARD.auctionValue;
      }
      if (player.player.draftRanksByRankType.PPR) {
        p.rank_ppr = player.player.draftRanksByRankType.PPR.rank;
        p.auc_val_ppr = player.player.draftRanksByRankType.PPR.auctionValue;
      }
    }

    p.on_team = player.onTeamId;

    p.droppable = player.player.droppable;
    p.first_name = player.player.firstName;
    p.last_name = player.player.lastName;
    p.full_name = player.player.fullName;
    p.position = positionByEligibleSlotId(player.player.eligibleSlots);
    p.team = teamFromTeamId(player.player.proTeamId);

    p.number = player.player.jersey;
    p.injured = player.player.injured;
    p.injury_status = player.player.injuryStatus;

    if (player.player.ownership) {
      p.own_activity_level = player.player.ownership.activityLevel;
      p.own_auc_val_avg = player.player.ownership.auctionValueAverage;
      p.own_auc_val_avg_change =
        player.player.ownership.auctionValueAverageChange;

      p.own_draft_pos_avg = player.player.ownership.averageDraftPosition;
      p.own_draft_pos_pct_change =
        player.player.ownership.averageDraftPositionPercentChange;

      p.own_pct = player.player.ownership.percentOwned;
      p.own_pct_changed = player.player.ownership.percentChange;
      p.own_pct_started = player.player.ownership.percentStarted;
    }

    p.pro_team_id = player.player.proTeamId;
    p.status = player.status;

    if (player.ratings) {
      p.pos_rank = player.ratings["0"].positionalRanking;
      p.tot_rank = player.ratings["0"].totalRanking;
      p.tot_rating = player.ratings["0"].totalRating;
    }

    if (p.tot_rating === 0) {
      p.pos_rank = 366;
    }

    return p;
  } catch (error) {
    throw error;
  }
}

function positionByEligibleSlotId(slotIds: number[]) {
  // @ts-ignore
  // TODO: figure this out
  const includes = b => a => _.includes(a, b);
  // QBs qualify for 2
  if (includes(0)(slotIds)) {
    return "QB";
  }

  if (includes(2)(slotIds) && includes(4)(slotIds)) {
    return "RB/WR";
  }
  // RBs qualify for 2
  if (includes(2)(slotIds)) {
    return "RB";
  }
  // WRs qualify for 3
  if (includes(3)(slotIds)) {
    return "WR";
  }
  // TEs qualify for 5
  if (includes(5)(slotIds)) {
    return "TE";
  }
  // Ks qualify for 17
  if (includes(17)(slotIds)) {
    return "K";
  }
  // D/ST qualify for 16
  if (includes(16)(slotIds)) {
    return "D/ST";
  }
  // dual rbs and rs should qualify for 2 and 4

  return "None";
}

function teamFromTeamId(teamId: number) {
  //@ts-ignore
  return nflTeamIdToNFLTeamAbbreviation[teamId];
}
