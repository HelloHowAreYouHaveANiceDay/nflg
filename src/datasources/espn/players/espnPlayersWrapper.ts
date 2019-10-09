import api from "../../api";
import parseRawPlayer from "./parseRawPlayer";

export default class espnPlayersWrapper {
  constructor() {}

  async getFantasyPlayers() {
    // console.log(this.playersEndpoint);
    const url =
      "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leaguedefaults/1?scoringPeriodId=1&view=kona_player_info";
    try {
      const response = await api.get(url, {
        headers: {
          //   "Content-Type": "application/json;charset=utf-8"
          // "Cache-Control": "no-cache"
          "Accept-Encoding": "gzip, deflate"
        }
      });
      const players = response.data.players;
      // console.log(players);
      return players.map(parseRawPlayer);
    } catch (error) {
      throw error;
    }
  }
}
