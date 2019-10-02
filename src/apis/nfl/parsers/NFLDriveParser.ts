import {
  NFLSingleGameResponse,
  nflDrive,
  nflApiGame
} from "../entities/NFLSingleGameResponse";
import { NFLDrive } from "../entities/NFLDrive";
import R from "ramda";
import { gameIDandGameFromGameResponse as gameIDandGameFromSingleGameResponse } from "./Utils";

export function NFLDrivesFromSingleGameResponse(
  res: NFLSingleGameResponse
): NFLDrive[] {
  const [game_id, game] = gameIDandGameFromSingleGameResponse(res);
  const rawDrives = game.drives;

  const parsedDrives: NFLDrive[] = [];
  R.forEachObjIndexed((rawDrive, drive_id) => {
    parsedDrives.push(
      NFLDriveFromRawDrive(game_id)(drive_id.toString())(rawDrive)
    );
  }, rawDrives);

  return parsedDrives;
}

const NFLDriveFromRawDrive = (game_id: string) => (drive_id: string) => (
  d: nflDrive
): NFLDrive => {
  const parsedDrive: NFLDrive = {
    game_id,
    drive_id,
    start_field: positionToOffset(d.posteam, d.start.yrdln),
    end_field: positionToOffset(d.posteam, d.end.yrdln),
    first_downs: d.fds,
    pos_team: d.posteam,
    pos_time: d.postime,
    play_count: d.numplays,
    result: d.result,
    penalty_yds: d.penyds,
    yds_gained: d.ydsgained
  };
  if (d.start) {
    parsedDrive.start_qtr = d.start.qtr;
    parsedDrive.start_time = d.start.time;
  }
  if (d.end) {
    parsedDrive.end_qtr = d.end.qtr;
    parsedDrive.end_time = d.end.time;
  }
  return parsedDrive;
};

function positionToOffset(own: string, yrdln: string) {
  // Uses a varied offset technique than burntsushi/nfldb
  // Own -50 -40 -30 -20 -10 0 10 20 30 40 50 Opp
  // Don't have to fiddle with embedded names

  // if yrdln is 50 there isn't a team string
  if (yrdln == "50") {
    return 0;
  }
  const [team, yard] = yrdln.split(" ");
  return team == own ? +yard - 50 : 50 - +yard;
}
