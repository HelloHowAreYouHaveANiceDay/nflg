import { Endpoint } from "../../../core/Endpoint";
import { Result } from "../../../core/Result";
import { AxiosInstance } from "axios";
import { NFLSingleGameResponse } from "../entities/NFLSingleGameResponse";

interface request {
  get(url: string): Promise<any>;
}
export class NFLSingleGameEndpoint implements Endpoint {
  url: string;
  game_id: number;
  request: request;

  constructor(game_id: number, request: request) {
    this.request = request;
    this.game_id = game_id;
    this.url = `https://www.nfl.com/liveupdate/game-center/${game_id}/${game_id}_gtd.json`;
  }

  async execute(): Promise<Result<NFLSingleGameResponse>> {
    try {
      const response = await this.request.get(this.url);
      const data = JSON.parse(response.data);
      const game = data[this.game_id.toString()];
      return Result.ok(game);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
