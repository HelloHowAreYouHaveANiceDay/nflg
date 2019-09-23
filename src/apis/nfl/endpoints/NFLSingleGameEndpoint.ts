import { Endpoint } from "../../../core/Endpoint";
import { Result } from "../../../core/Result";
import { AxiosInstance } from "axios";
import { NFLSingleGameResponse } from "../entities/NFLSingleGameResponse";
export class NFLSingleGameEndpoint implements Endpoint {
  url: string;
  game_id: number;
  request: AxiosInstance;

  constructor(game_id: number, request: AxiosInstance) {
    this.request = request;
    this.game_id = game_id;
    this.url = `https://www.nfl.com/liveupdate/game-center/${game_id}/${game_id}_gtd.json`;
  }

  async execute(): Promise<Result<NFLSingleGameResponse>> {
    try {
      const response = await this.request.get(this.url);
      const data = response.data[this.game_id];
      return Result.ok(data);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
