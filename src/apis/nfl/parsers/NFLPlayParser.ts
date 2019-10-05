import {
  NFLSingleGameResponse,
  nflDrive,
  nflPlay
} from "../entities/NFLSingleGameResponse";
import { NFLPlay } from "../entities/NFLPlay";
import { gameIDandGameFromGameResponse, positionToOffset } from "./Utils";
import _ from "lodash";

export function NFLPlaysFromSingleGameResponse(
  res: NFLSingleGameResponse
): NFLPlay[] {
  const [game_id, game] = gameIDandGameFromGameResponse(res);

  const plays: NFLPlay[] = [];
  _.forEach(game.drives, (drive: nflDrive, drive_id: string) => {
    _.forEach(drive.plays, (rawPlay, play_id) => {
      plays.push(NFLPlayFromRawPlay(game_id)(drive_id)(play_id)(rawPlay));
    });
  });

  return plays;
}

const NFLPlayFromRawPlay = (game_id: string) => (drive_id: string) => (
  play_id: string
) => (play: nflPlay): NFLPlay => {
  const p: NFLPlay = {
    game_id,
    drive_id,
    play_id,
    time: play.time,
    pos_team: play.posteam,
    yardline: positionToOffset(play.posteam, play.yrdln),
    down: play.down,
    yards_to_go: play.ydstogo,
    description: play.desc,
    note: play.note
  };
  return p;
};
