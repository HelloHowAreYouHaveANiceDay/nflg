import { IEspnFantasyPlayers } from "./espn/entities/espnFantasyPlayers";
import EspnPlayer from "../Entities/EspnPlayer";

// Describes generic parsers that various endpoint should provide
export interface Parser {
  parse(): any;
}

export interface PlayersParser {
  parsePlayers(root: any): any[];
}

export interface GameParser {
  parseGames(root: any): any[];
}

export interface ProTeamsParser {
  parseProTeams(root: any): any[];
}
