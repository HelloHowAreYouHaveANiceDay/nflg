export interface scheduleGame {
  game_id: string;
  weekday: string;
  time: string;
  year: number;
  month: number;
  day: number;
  season_type: string;
  game_type: string;
  week: number;
  quarter: string;
  home_short: string;
  home_name: string;
  home_score: number;
  away_short: string;
  away_name: string;
  away_score: number;
}
