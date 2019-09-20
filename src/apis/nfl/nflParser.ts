import { PlayersParser } from "../parser";
import { INFLApiGameResponse } from "./nflApiGame";
import Player from "../../Entities/Player";

class nflParser implements PlayersParser {
  parsePlayers(root: INFLApiGameResponse): Player[] {
    return [];
  }
}
