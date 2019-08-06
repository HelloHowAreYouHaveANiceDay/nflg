// JSON structure returned from nflGame endpoint.
export interface nflApiGameResponse {
  // key is gameid
  [key: string]: nflApiGame | number;
  nextupdate: number;
}

export interface nflApiGame {
  // home and away team summaries
  home: nflTeamData;
  away: nflTeamData;
  // data about all the drives in a game
  drives: nflDrives;
  // data of all scoring plays
  scrsummary: nflScoringPlays;
  weather: string | null;
  media: string | null;
  yl: string;
  qtr: string;
  note: string | null;
  down: number;
  togo: number;
  redzone: boolean;
  clock: string;
  posteam: string;
  stadium: string | null;
}

export interface nflScoringPlays {
  [key: string]: nflScoringPlay;
}

export interface nflScoringPlay {
  type: string;
  desc: string;
  qtr: number;
  team: string;
  players: {
    // playerName: playerid
    [key: string]: string;
  };
}

export interface nflTeamData {
  score: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    T: number;
  };
  abbr: string;
  to: number;
  stats: nflAggGameStats;
  players: any | null;
}

export interface nflPlayerAggGameStat {
  name: string;
  att?: number;
  cmp?: number;
  yds?: number;
  tds?: number;
  rec?: number;
  ints?: number;
  lngtd?: number;
  tot?: number;
  rcv?: number;
  trcv?: number;
  lost?: number;
  lng?: number;
  twopta?: number;
  twoptm?: number;
  fgm?: number;
  fga?: number;
  fgyds?: number;
  forced?: number;
  notforced?: number;
  oob?: number;
  ret?: number;
  pts?: number;
  rec_yds?: number;
  rec_tds?: number;
  totpfg: number;
  xpmade?: number;
  xpa?: number;
  xpb?: number;
  xptot?: number;
  avg?: number;
  i20?: number;
  tkl?: number;
  ast?: number;
  sk?: number;
  int?: number;
  ffum?: number;
}

export interface nflDrives {
  [key: string]: nflDrive;
  // crntdrv: number;
}

export interface nflDrive {
  sp: number;
  posteam: string;
  qtr: number;
  redzone: boolean;
  plays: {
    [key: string]: nflPlay;
  };
  fds: number;
  result: string;
  penyds: number;
  ydsgained: number;
  numplays: number;
  postime: string;
  start: {
    qtr: number;
    time: string;
    yrdln: string;
    team: string;
  };
  end: {
    qtr: number;
    time: string;
    yrdln: string;
    team: string;
  };
}

export interface nflPlay {
  sp: number;
  qtr: number;
  down: number;
  time: string;
  yrdln: string;
  ydstogo: number;
  ydsnet: number;
  posteam: string;
  desc: string;
  note: string;
  players: nflPlayPlayerStats;
}

export interface nflPlayPlayerStats {
  [key: string]: nflPlayPlayerStat[];
}

export interface nflPlayPlayerStat {
  sequence: number;
  clubcode: string;
  playerName: string;
  statId: number;
  yards: number;
}

export interface nflAggGameStats {
  passing: {
    [key: string]: nflPlayerAggGameStat;
  };
  rushing: {
    [key: string]: nflPlayerAggGameStat;
  };
  receiving: {
    [key: string]: nflPlayerAggGameStat;
  };
  fumbles: {
    [key: string]: nflPlayerAggGameStat;
  };
  kicking: {
    [key: string]: nflPlayerAggGameStat;
  };
  punting: {
    [key: string]: nflPlayerAggGameStat;
  };
  kickret: {
    [key: string]: nflPlayerAggGameStat;
  };
  puntret: {
    [key: string]: nflPlayerAggGameStat;
  };
  defense: {
    [key: string]: nflPlayerAggGameStat;
  };
  team: {
    [key: string]: {
      totfd: number;
      totyds: number;
      pyds: number;
      ryds: number;
      pen: number;
      penyds: number;
      trnovr: number;
      pt: number;
      ptyds: number;
      ptavg: number;
      top: string;
    };
  };
}
