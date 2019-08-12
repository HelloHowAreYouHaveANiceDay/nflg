import LocalCache from "../../cache/LocalCache";
import api from "../api";
import { nflApiGameResponse, nflApiGame } from "../../Entities/nflApiGame";
import { EROFS } from "constants";

export default class GameWrapper {
  cache: LocalCache | null = null;
  constructor(cache?: LocalCache) {
    if (cache) {
      this.cache = cache;
    }
  }

  private getGameUrl(game_id: string) {
    return `https://www.nfl.com/liveupdate/game-center/${game_id}/${game_id}_gtd.json`;
  }

  async getGame(game_id: string): Promise<nflApiGameResponse> {
    try {
      if (this.cache) {
        const exists = this.cache.hasGame(game_id);
        if (exists) {
          const response = ((await this.cache.readGame(
            game_id
          )) as unknown) as nflApiGameResponse;
          return response;
        }
      }

      const url = this.getGameUrl(game_id);
      const response = await api.get(url);

      if (this.cache) {
        await this.cache.saveGame(game_id, response.data);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private extractGameId(response: nflApiGameResponse) {
    Object.keys(response).forEach(key => {
      if (key != "nextupdate") {
        return key;
      }
    });
    throw new Error("invalid response");
  }

  static parseDrives(response: nflApiGameResponse) {
    try {
      const game_id = this.extractGameId(response);
      const game = response[game_id] as nflApiGame;
      const drives = game.drives;
    } catch (error) {}
  }
}
