import { NFLSingleGameResponse } from "../apis/nfl/entities/NFLSingleGameResponse";
import { Game } from "../Entities/Game";
import { Parser } from "./Parser";
import { Result } from "../core/Result";

export const NFLGameFromSingleGameResponse: Parser<
  NFLSingleGameResponse,
  Game
> = game_response => {
  return Result.ok();
};

export const NFLGamesFromScheduleWeekResponse: Parser<string, Game[]> = xml => {
  return Result.ok();
};
