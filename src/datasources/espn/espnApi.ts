//@ts-ignore
import _ from "lodash";
import axios, { AxiosRequestConfig } from "axios";
import parseRawPlayer from "./players/parseRawPlayer";
import { parseTeamsFromSettings } from "./parseRawSettings";

axios.defaults.baseURL = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/";
export interface EspnApiParams {
  leagueId: number;
  espns2?: string;
  swid?: string;
}

export default class EspnApi {
  leagueId: number;
  espns2: string;
  swid: string;

  constructor(params: EspnApiParams) {
    this.leagueId = params.leagueId;

    if (params.espns2 && params.swid) {
      this.espns2 = params.espns2;
      this.swid = params.swid;
    }
  }

  private mergeCookie(config?: AxiosRequestConfig) {
    if (this.espns2 && this.swid) {
      const headers = { cookie: `espn_s2=${this.espns2}; swid=${this.swid};` };
      return _.merge({}, config, { headers, withcredentials: true });
    }
    return config;
  }

  async getFantasyPlayers(year: number = 2019, scoringPeriod: number = 0) {
    const url = `${year}/segments/0/leagues/${this.leagueId}?scoringPeriodId=${scoringPeriod}&view=kona_player_info`;
    const response = await axios.get(url, this.mergeCookie());
    const players = response.data.players;
    return players.map(parseRawPlayer);
  }

  async getFantasyTeams(year: number = 2019) {
    try {
      const url = `${year}/segments/0/leagues/${this.leagueId}?view=mSettings&view=mTeam&view=modular&view=mNav`;
      const response = await axios.get(url, this.mergeCookie());
      const teams = parseTeamsFromSettings(response.data);
      return teams;
    } catch (error) {
      throw error;
    }
  }
}
