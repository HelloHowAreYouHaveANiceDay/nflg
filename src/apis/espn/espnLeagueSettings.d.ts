import { espnGameNotificationSettings } from "./espnProTeamSchedule";

export interface EspnFFLSettings {
  draftDetail: {
    drafted: boolean;
    inProgress: boolean;
  };
  gameId: number;
  id: number;
  members: EspnFFLMember[];

  scoringPeriodId: number;

  seasonId: number;

  segmentId: number;

  settings: EspnLeagueSettings;

  status: EspnLeagueStatus;

  teams: EspnFFLTeam[];
}

export interface EspnFFLTeam {
  abbrev: string;
  currentProjectedRank: number;
  divisionId: number;
  draftDayProjectedRank: number;
  id: number;
  isActive: false;
  location: string;
  logo: string;
  logoType: string;
  nickname: string;
  owners: string[];
  playoffSeed: number;
  points: number;
  pointsAdjusted: number;
  pointsDelta: number;
  primaryOwner: string;
  rankCalculatedFinal: number;
  rankFinal: number;
  record: {
    away: EspnFFLRecord;
    division: EspnFFLRecord;
    home: EspnFFLRecord;
    overall: EspnFFLRecord;
  };
  tradeBlock: any;
  transactionCounter: {
    acquisitionBudgetSpent: number;
    acquisitions: number;
    drops: number;
    matchupAcquisitionTotals: any;
    misc: number;
    moveToActive: number;
    moveToIR: number;
    paid: number;
    teamCharges: number;
    trades: number;
  };
  waiverRank: number;
}

export interface EspnFFLRecord {
  gamesBack: number;
  losses: number;
  percentage: number;
  pointsAgainst: number;
  pointsFor: number;
  streakLength: number;
  streakType: string;
  ties: number;
  wins: number;
}
export interface EspnLeagueStatus {
  activatedDate: number;
  createdAsLeagueType: number;
  currentLeagueType: number;
  currentMatchupPeriod: number;
  finalScoringPeriod: number;
  firstScoringPeriod: number;
  isActive: boolean;
  isExpired: boolean;
  isFull: boolean;
  isPlayoffMatchupEdited: boolean;
  isToBeDeleted: boolean;
  isViewable: boolean;
  isWaiverOrderEdited: boolean;
  latestScoringPeriod: number;
  previousSeasons: number[];
  teamsJoined: number;
  transactionScoringPeriod: number;
  waiverLastExecutionDate: number;
  waiverProcessStatus: {};
}

export interface EspnFFLMember {
  displayName: string;
  firstName: string;
  id: string;
  isLeagueCreator: boolean;
  isLeagueMamager: boolean;

  lastName: string;

  notificationSettings: EspnMemberNotificationSetting[];
}

export interface EspnMemberNotificationSetting {
  enabled: boolean;
  id: string;
  type:
    | "TEAM_PLAYER_INJURY"
    | "TEAM_PLAYER_AVAILABILITY"
    | "TEAM_PLAYER_STARTBENCH"
    | "TEAM_PLAYER_NEWS"
    | "TEAM_TRADE_OFFER"
    | "TEAM_LINEUP"
    | "DRAFT"
    | "DIRECT_CHAT"
    | "TEAM_DAILY_REPORT";
}

export interface EspnLeagueSettings {
  acquisitionSettings: {
    acquisitionBudget: number;
    acquisitonLimit: number;
    acquisitionType: string;
    isUsingAcquisitionBudget: boolean;
    isUsingVickeryRules: boolean;
    matchupAcquisitionLimit: number;
    matchupLimitPerScoringPeriod: boolean;
    minimumBid: number;
    waiverHours: number;
    waiverOrderReset: boolean;
    waiverProcessDays: [
      "MONDAY",
      "FRIDAY",
      "THURSDAY",
      "SATURDAY",
      "WEDNESDAY",
      "SUNDAY"
    ];
    waiverProcessHour: number;
  };

  draftSettings: {
    auctionBudget: number;
    availableDate: number;
    date: number;
    isTradingEnabled: boolean;
    keeperCount: number;
    keeperCountFuture: number;
    keeperOrderType: string;
    leagueSubType: string;
    orderType: string;
    pickOrder: number[];
    timePerSelection: number;
    type: string;
  };

  financeSettings: {
    entryFee: number;
    miscFee: number;
    perLoss: number;
    perTrade: number;
    playerAcquisition: number;
    playerDrop: number;
    playerMoveToActive: number;
    playerMoveToIR: number;
  };

  isCustomizable: boolean;
  isPublic: boolean;
  name: string;
  restrictionType: string;

  rosterSettings: {
    isBenchUnlimited: boolean;
    isUsingUndroppableList: boolean;
    lineupLocktimeType: string;
    lineupSlotCounts: {
      "0": number;
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
      "6": number;
      "7": number;
      "8": number;
      "9": number;
      "10": number;
      "11": number;
      "12": number;
      "13": number;
      "14": number;
      "15": number;
      "16": number;
      "17": number;
      "18": number;
      "19": number;
      "20": number;
      "21": number;
      "22": number;
      "23": number;
      "24": number;
    };
    lineupSlotStatLimits: object;
    moveLimit: number;
    positionLimits: {
      "0": number;
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
      "6": number;
      "7": number;
      "8": number;
      "9": number;
      "10": number;
      "11": number;
      "12": number;
      "13": number;
      "14": number;
      "15": number;
      "16": number;
      "17": number;
    };
    rosterLocktimeType: string;
    universeIds: number[];
  };

  scheduleSettings: {
    divisions: EspnFFLDivision[];
    matchupPeriodCount: number;
    matchupPeriodLength: number;
    matchupPeriods: {
      "1": [number];
      "2": [number];
      "3": [number];
      "4": [number];
      "5": [number];
      "6": [number];
      "7": [number];
      "8": [number];
      "9": [number];
      "10": [number];
      "11": [number];
      "12": [number];
      "13": [number];
      "14": [number];
      "15": [number];
      "16": [number];
    };
    periodTypeId: number;
    playoffMatchupPeriodLength: number;
    playoffSeedingRule: string;
    playoffSeedingRuleBy: number;
    playoffTeamCount: number;
  };

  scoringSettings: {
    allowOutOfPositionScoring: false;
    homeTeamBonus: 0;
    matchupTieRule: "NONE";
    matchupTieRuleBy: 0;
    playerRankType: "PPR";
    playoffHomeTeamBonus: 0;
    playoffMatchupTieRule: "NONE";
    playoffMatchupTieRuleBy: 0;
    scoringItems: EspnFFLScoringItem[];
    scoringType: "H2H_POINTS";
  };

  size: number;
  tradeSettings: {
    allowOutOfUniverse: boolean;
    deadlineDate: number;
    max: number;
    revisionHours: number;
    vetoVotesRequired: number;
  };
}

export interface EspnFFLScoringItem {
  isReverseItem: boolean;
  leagueRanking: number;
  leagueTotal: number;
  points: number;
  pointsOverrides: {
    [key: string]: number;
  };
  statId: number;
}

export interface EspnFFLDivision {
  id: number;
  name: string;
  size: number;
}
