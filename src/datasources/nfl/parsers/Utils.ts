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

export const applyKeyToValues = (keyAsProperty: string) => (root: {
  [key: string]: any[];
}) => {
  const values = Object.keys(root).map(k =>
    root[k].map(o => {
      const n = {
        ...o
      };
      n[keyAsProperty] = k;
      return n;
    })
  );

  return R.flatten(values);
};

export function positionToOffset(own: string, yrdln: string) {
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
