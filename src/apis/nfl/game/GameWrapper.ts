import LocalCache from "../../../cache/LocalCache";
import api from "../../api";
import {
  NFLSingleGameResponse,
  nflApiGame,
  nflDrive
} from "../entities/NFLSingleGameResponse";
import { Drive } from "../../../Entities/Drive";
import _ from "lodash";
import Play from "../../../Entities/Play";
import { statsDict } from "./Stats";
import PlayPlayer from "../../../Entities/PlayPlayer";

export default class GameWrapper {
  cache: LocalCache;
  constructor(cache?: LocalCache) {
    if (cache) {
      this.cache = cache;
    }
  }

  private getGameUrl(game_id: string) {
    return `https://www.nfl.com/liveupdate/game-center/${game_id}/${game_id}_gtd.json`;
  }

  async getGame(game_id: string): Promise<NFLSingleGameResponse> {
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

      return response.data;
    } catch (error) {
      throw error;
    }
  }
  parseDrives(response: NFLSingleGameResponse) {
    try {
      const game_id = extractGameId(response);
      // console.log(game_id);
      const game = response[game_id] as nflApiGame;
      const drives = game.drives;
      return _.transform(
        drives,
        (result: Drive[], rawDrive, drive_id) => {
          const d = mapDriveProperties(game_id, rawDrive, drive_id);
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

  parsePlays(response: NFLSingleGameResponse) {
    try {
      const game_id = extractGameId(response);
      const game = response[game_id] as nflApiGame;
      const drives = game.drives;
      const plays: rawPlay[] = [];
      _.forEach(drives, (drive, drive_id) => {
        _.forEach(drive.plays, (play, play_id) => {
          const p = {
            game_id,
            drive_id,
            play_id,
            ...play
          };
          plays.push(_.omit(p, "players"));
        });
      });
      return plays.map(mapPlayProperties);
    } catch (error) {
      throw error;
    }
  }

  parsePlayPlayers(response: NFLSingleGameResponse) {
    try {
      const game_id = extractGameId(response);
      const game = response[game_id] as nflApiGame;
      const drives = game.drives;
      const playPlayers: PlayPlayer[] = [];
      _.forEach(drives, (drive, drive_id) => {
        _.forEach(drive.plays, (play, play_id) => {
          _.forEach(play.players, (sequence, player_id) => {
            const p: PlayPlayer = {
              player_id,
              game_id,
              drive_id,
              play_id
            };

            sequence.forEach(stat => {
              // TODO: add relational
              p.team = stat.clubcode;
              p.player_short = stat.playerName;
              if (player_id == "0") {
                p.player_id = stat.clubcode;
              }

              const statdef = statsDict[`${stat.statId}`];

              if (statdef) {
                statdef.fields.forEach(field => {
                  const val = statdef.value ? statdef.value : 1;
                  //@ts-ignore
                  p[field] = val;
                });

                if (statdef.yds.length > 0) {
                  //@ts-ignore
                  p[statdef.yds] = stat.yards;
                }
              }
            });

            playPlayers.push(p);
          });
        });
      });
      return playPlayers;
    } catch (error) {
      throw error;
    }
  }

  parsePlayerStubs(response: NFLSingleGameResponse) {
    try {
      const game_id = extractGameId(response);
      const game = response[game_id] as nflApiGame;
      const drives = game.drives;

      const player_ids: { player_id: string; short_name: string }[] = [];
      const dupeCheck: string[] = [];
      _.forEach(drives, (drive, drive_id) => {
        _.forEach(drive.plays, (play, play_id) => {
          _.forEach(play.players, (sequence, player_id) => {
            let p_id = player_id;
            let p_short = "";

            sequence.forEach(stat => {
              p_short = stat.playerName;
              if (player_id === "0") {
                p_id = stat.clubcode;
                p_short = stat.clubcode;
              }
            });

            if (dupeCheck.includes(p_id)) {
            } else {
              player_ids.push({
                player_id: p_id,
                short_name: p_short
              });
              dupeCheck.push(p_id);
            }
          });
        });
      });
      // console.log(player_ids);
      return player_ids;
    } catch (error) {
      throw error;
    }
  }
}

interface rawPlay {
  sp: number;
  qtr: number;
  down: number;
  time: string;
  yrdln: string;
  ydstogo: number;
  ydsnet: number;
  posteam: string;
  desc: string;
  note: string;
  game_id: string;
  drive_id: string;
  play_id: string;
}

function mapPlayProperties(play: rawPlay) {
  const p: Play = {
    game_id: play.game_id,
    drive_id: play.drive_id,
    play_id: play.play_id,
    time: play.time,
    pos_team: play.posteam,
    yardline: positionToOffset(play.posteam, play.yrdln),
    down: play.down,
    yards_to_go: play.ydstogo,
    description: play.desc,
    note: play.note
  };

  return p;
}

function extractGameId(response: NFLSingleGameResponse) {
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

const mapDriveProperties = (
  game_id: string,
  rawDrive: nflDrive,
  drive_id: string
) => {
  if (rawDrive.start) {
    const drive: Drive = {
      game_id: game_id,
      drive_id: drive_id,
      start_field: positionToOffset(rawDrive.posteam, rawDrive.start.yrdln),
      end_field: positionToOffset(rawDrive.posteam, rawDrive.end.yrdln),
      first_downs: rawDrive.fds,
      pos_team: rawDrive.posteam,
      pos_time: rawDrive.postime,
      play_count: rawDrive.numplays,
      result: rawDrive.result,
      penalty_yds: rawDrive.penyds,
      yds_gained: rawDrive.ydsgained,
      start_qtr: rawDrive.start.qtr,
      start_time: rawDrive.start.time,
      end_qtr: rawDrive.end.qtr,
      end_time: rawDrive.end.time
    };

    return drive;
  }
  return false;
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
