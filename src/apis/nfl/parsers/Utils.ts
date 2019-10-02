import {
  NFLSingleGameResponse,
  nflApiGame
} from "../entities/NFLSingleGameResponse";
import R from "ramda";

export function gameIDandGameFromGameResponse(
  res: NFLSingleGameResponse
): [string, nflApiGame] {
  const game_id = R.filter(
    (k: string) => k !== "nextupdate",
    Object.keys(res)
  )[0];
  const game = res[game_id] as nflApiGame;
  return [game_id, game];
}

export const denestWithKey = (property: string) => (keyAsProperty: string) => (
  root: any
) => {
  const nestedValues = root[property];
  const addKey = ([k, v]: [string, any]) => {
    const nv = {
      ...v
    };
    nv[keyAsProperty.toString()] = k;
    return nv;
  };

  return R.toPairs(nestedValues).map(addKey);
};
