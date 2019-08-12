import LocalCache from "../../cache/LocalCache";
import api from "../api";
import {
  nflApiGameResponse,
  nflApiGame,
  nflDrive
} from "../../Entities/nflApiGame";
import { Drive } from "../../Entities/Drive";
import _ from "lodash";

export default class GameWrapper {
  cache: LocalCache | null = null;
  constructor(cache?: LocalCache) {
    if (cache) {
      this.cache = cache;
    }
  }

  private getGameUrl(game_id: string) {
    return `https://www.nfl.com/liveupdate/game-center/${game_id}/${game_id}_gtd.json`;
  }

  async getGame(game_id: string): Promise<nflApiGameResponse> {
    try {
      if (this.cache) {
        const exists = await this.cache.hasGame(game_id);
        // console.log(`${exists} exists`);
        if (exists) {
          const response = await this.cache.readGame(game_id);
          return JSON.parse(response);
        }
      }

      const url = this.getGameUrl(game_id);
      const response = await api.get(url);

      if (this.cache) {
        await this.cache.saveGame(game_id, JSON.stringify(response.data));
      }

      return JSON.parse(response.data);
    } catch (error) {
      throw error;
    }
  }

  private extractGameId(response: nflApiGameResponse) {
    let k;
    Object.keys(response).forEach(key => {
      // console.log(key);
      if (key != "nextupdate") {
        k = key;
      }
    });
    if (k) {
      return k;
    }
    throw new Error("invalid response");
  }

  parseDrives(response: nflApiGameResponse) {
    try {
      const game_id = this.extractGameId(response);
      // console.log(game_id);
      const game = response[game_id] as nflApiGame;
      const drives = game.drives;
      return _.transform(
        drives,
        (result: Drive[], rawDrive, drive_id) => {
          const d = this.driveRawToEntity(game_id, rawDrive, drive_id);
          if (d) {
            result.push(d);
          }
        },
        []
      );
    } catch (error) {
      throw error;
    }
  }

  private driveRawToEntity = (
    game_id: string,
    rawDrive: nflDrive,
    drive_id: string
  ) => {
    if (rawDrive.start) {
      const drive = new Drive();

      drive.game_id = game_id;
      drive.drive_id = drive_id;
      drive.start_field = positionToOffset(
        rawDrive.posteam,
        rawDrive.start.yrdln
      );
      drive.end_field = positionToOffset(rawDrive.posteam, rawDrive.end.yrdln);
      drive.first_downs = rawDrive.fds;
      drive.pos_team = rawDrive.posteam;
      drive.pos_time = rawDrive.postime;
      drive.play_count = rawDrive.numplays;
      drive.result = rawDrive.result;
      drive.penalty_yds = rawDrive.penyds;
      drive.yds_gained = rawDrive.ydsgained;
      drive.start_qtr = rawDrive.start.qtr;
      drive.start_time = rawDrive.start.time;
      drive.end_qtr = rawDrive.end.qtr;
      drive.end_time = rawDrive.end.time;

      return drive;
    }
    return false;
  };
}

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

/**
 * converts the offset back with given team names
 *
 * @param own
 * @param opp
 * @param offset
 */
function offsetToPosition(own: string, opp: string, offset: number) {
  const pos = offset > 0 ? opp : own;
  const yds = offset > 0 ? 50 - offset : offset + 50;
  return `${pos} ${yds}`;
}
