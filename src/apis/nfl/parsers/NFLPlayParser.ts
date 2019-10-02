import { NFLSingleGameResponse } from "../entities/NFLSingleGameResponse";
import { NFLPlay } from "../entities/NFLPlay";

export function NFLPlaysFromSingleGameResponse(
  res: NFLSingleGameResponse
): NFLPlay[] {}
