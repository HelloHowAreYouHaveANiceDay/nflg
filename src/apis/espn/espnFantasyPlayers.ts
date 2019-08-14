export interface espnFantasyPlayers {
  players: espnPlayerEntry[];
}

export interface espnPlayerEntry {
  id: number;
  draftAuctionValue: number;
  keeperValue: number;
  keeperValueFuture: number;

  lineupLocked: boolean;

  onTeamId: number;

  player: espnFantasyPlayer;
  ratings: espnFantasyPlayerRatings;

  rosterLocked: boolean;

  stats: string;

  tradeLocked: boolean;

  waiverProcessDate: number;
}

export interface espnFantasyPlayerRatings {
  [key: string]: {
    positionalRanking: number;
    totalRanking: number;
    totalRating: number;
  };
}

export interface espnFantasyPlayer {
  active: boolean;

  defaultPositionId: number;

  draftRanksByType: {
    STANDARD: espnDraftRank;
    PPR: espnDraftRank;
  };

  droppable: boolean;
  eligibleSlots: number[];

  firstName: string;

  lastName: string;

  fullName: string;

  id: number;

  injured: boolean;

  injuryStatus: string;

  jersey: number;

  lastNewsDate: number;

  ownership: espnPlayerOwnership;

  proTeamId: number;

  stats: espnPlayerStat[];
}

export interface espnPlayerStat {
  appliedTotal: number;

  externalId: string;

  id: string;

  proTeamId: number;

  seasonId: number;

  statSourceId: number;

  statSplitTypeId: number;

  stats: {
    [key: string]: number;
  };
}

export interface espnPlayerOwnership {
  activityLevel: string;

  auctionValueAverage: number;

  auctionValueAverageChange: number;

  averageDraftPosition: number;

  averageDraftPositionPercentageChange: number;

  date: number;

  leagueType: number;

  percentChange: number;

  percentOwned: number;

  percentStarted: number;
}

export interface espnDraftRank {
  auctionValue: number;
  rank: number;
  rankSourceId: number;

  rankType: string;

  slotId: number;
}
