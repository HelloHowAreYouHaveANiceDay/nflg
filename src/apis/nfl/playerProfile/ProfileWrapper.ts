import { parseProfile } from "./parseProfile";
import api from "../../api";

export default class ProfileWrapper {
  constructor() {}

  private getProfileUrl(player_id: string) {
    return `https://www.nfl.com/players/profile?id=${player_id}`;
  }

  async getPlayerProfile(player_id: string) {
    try {
      const url = this.getProfileUrl(player_id);
      const response = await api.get(url);
      return parseProfile(response.data);
    } catch (error) {
      console.log(error.message);
      // throw error;
      return {};
    }
  }
}
