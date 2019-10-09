import { NFLSingleGameResponse } from "../entities/NFLSingleGameResponse";
import { NFLPlayer } from "../entities/NFLPlayer";
import { gameIDandGameFromGameResponse } from "./Utils";
import _ from "lodash";

export function NFLPlayersFromSingleGameResponse(
  res: NFLSingleGameResponse
): NFLPlayer[] {
  const [game_id, game] = gameIDandGameFromGameResponse(res);

  const dupeCheck: string[] = [];
  const p: NFLPlayer[] = [];

  _.forEach(game.drives, (drive, drive_id) => {
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
          p.push({
            player_id: p_id,
            short_name: p_short
          });
          dupeCheck.push(p_id);
        }
      });
    });
  });

  return p;
}
