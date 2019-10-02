import { NFLSingleGameResponse } from "../entities/NFLSingleGameResponse";
import { NFLPlayer } from "../entities/NFLPlayer";

export function NFLPlayersFromSingleGameResponse(
  res: NFLSingleGameResponse
): NFLPlayer[] {}
