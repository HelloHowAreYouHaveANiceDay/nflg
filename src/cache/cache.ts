import path from "path";
import fs from "fs-extra";

export default class LocalCache {
  cachePath: string;
  constructor(cachePath: string) {
    this.cachePath = path.join(__dirname, cachePath);
  }

  // Schedule Handlers
  private scheduleParamsToKey(year: number, season_type: string, week: number) {
    return `${season_type}_${year}_${week}`;
  }
  async hasSchedule(year: number, season_type: string, week: number) {
    const fileName = this.scheduleParamsToKey(year, season_type, week);
    const p = `${this.cachePath}/schedules/${fileName}.xml`;
    return await fs.pathExists(p);
  }

  async hasGame(game_id: string) {
    const p = `${this.cachePath}/games/${game_id}.json`;
    return await fs.pathExists(p);
  }
}
