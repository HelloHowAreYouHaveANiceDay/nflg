import { NFLSingleGameResponse } from "../entities/NFLSingleGameResponse";
import { NFLPlayerPlay } from "../entities/NFLPlayerPlay";
import { gameIDandGameFromGameResponse } from "./Utils";
import _ from "lodash";
import { statsDict } from "./Stats";

export function NFLPlayerPlaysFromSingleGameResponse(
  res: NFLSingleGameResponse
): NFLPlayerPlay[] {
  const [game_id, game] = gameIDandGameFromGameResponse(res);

  const pp: NFLPlayerPlay[] = [];

  _.forEach(game.drives, (drive, drive_id) => {
    _.forEach(drive.plays, (play, play_id) => {
      _.forEach(play.players, (sequence, player_id) => {
        const p: NFLPlayerPlay = {
          player_id,
          game_id,
          drive_id,
          play_id
        };

        sequence.forEach(stat => {
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

        pp.push(p);
      });
    });
  });

  return pp;
}
