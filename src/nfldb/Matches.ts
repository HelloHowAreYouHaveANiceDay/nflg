import Player from "../Entities/Player";
import EspnPlayer from "../Entities/EspnPlayer";
import _ from "lodash";
const Overrides = require("./override.json");

export const isEspnNflMatch = (espnPlayer: EspnPlayer) => (
  nflPlayer: Player
) => {
  try {
    const override = _.find(Overrides, { espn: espnPlayer.full_name });
    if (override && override.nfl) {
      //@ts-ignore
      return override.nfl === nflPlayer.full_name;
    } else {
      return (
        //@ts-ignore
        nflPlayer.full_name === espnPlayer.full_name
      );
    }
  } catch (error) {
    throw error;
  }
};
