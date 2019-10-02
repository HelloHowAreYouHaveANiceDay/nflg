import { NFLSingleGameResponse } from "../entities/NFLSingleGameResponse";
import { NFLPlayerPlay } from "../entities/NFLPlayerPlay";

export function NFLPlayerPlaysFromSingleGameResponse(
  res: NFLSingleGameResponse
): NFLPlayerPlay[] {}
