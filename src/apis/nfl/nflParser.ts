import { PlayersParser } from "../parser";
import { NFLSingleGameResponse } from "./entities/NFLSingleGameResponse";
import Player from "../../Entities/Player";

class nflParser implements PlayersParser {
  parsePlayers(root: NFLSingleGameResponse): Player[] {
    return [];
  }
}
