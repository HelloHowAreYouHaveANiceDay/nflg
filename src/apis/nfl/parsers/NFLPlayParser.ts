import {
  NFLSingleGameResponse,
  nflDrive,
  nflPlay
} from "../entities/NFLSingleGameResponse";
import { NFLPlay } from "../entities/NFLPlay";
import { gameIDandGameFromGameResponse, denestWithKey } from "./Utils";
import R from "ramda";

export function NFLPlaysFromSingleGameResponse(
  res: NFLSingleGameResponse
): NFLPlay[] {
  const [game_id, game] = gameIDandGameFromGameResponse(res);

  const drives = denestWithKey("drives")("drive_id")(game);
  const denestPlays = denestWithKey("plays")("play_id");

  const rawPlays = R.flatten(drives.map(denestPlays));
  console.log(drives);

  return drives;
}

function playIDAndRawPlaysFromDrive(d: nflDrive): [string, nflPlay][] {
  return R.toPairs(d.plays);
}
