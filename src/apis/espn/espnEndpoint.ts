import { Endpoint } from "../../core/Endpoint";
import { Result } from "../../core/Result";

export class EspnEndpoint implements Endpoint {
  url: "https://fantasy.espn.com/apis/v3/games/ffl/seasons/";
  execute() {
    return Result.ok();
  }
}
