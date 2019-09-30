import { NFLSingleGameResponse } from "../entities/NFLSingleGameResponse";

export interface NFLSingleGameParser {
  (respones: NFLSingleGameResponse): any;
}
