import path from "path";
import fs from "fs-extra";

export default class LocalCache {
  cachePath: string;
  constructor(cachePath: string) {
    let p: string;
    if (path.isAbsolute(cachePath)) {
      p = cachePath;
    } else {
      p = path.resolve(cachePath);
    }

    const exists = fs.pathExistsSync(p);
    if (exists) {
      console.log(`path set at: ${p}`);
      this.cachePath = p;
    } else {
      console.error(p);
      throw new Error("cache does not exist at given path");
    }
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

  async saveSchedule(
    year: number,
    season_type: string,
    week: number,
    xml: string
  ) {
    try {
      const fileName = this.scheduleParamsToKey(year, season_type, week);
      const p = `${this.cachePath}/schedules/${fileName}.xml`;
      const s = await fs.outputFile(p, xml);
      return s;
    } catch (error) {
      throw error;
    }
  }

  async readSchedule(year: number, season_type: string, week: number) {
    try {
      const fileName = this.scheduleParamsToKey(year, season_type, week);
      const p = `${this.cachePath}/schedules/${fileName}.xml`;
      const s = await fs.readFile(p, "utf-8");
      return s;
    } catch (error) {
      throw error;
    }
  }

  async deleteSchedule(year: number, season_type: string, week: number) {
    try {
      const fileName = this.scheduleParamsToKey(year, season_type, week);
      const p = `${this.cachePath}/schedules/${fileName}.xml`;
      await fs.remove(p);
    } catch (error) {
      throw error;
    }
  }
  // Game Handlers
  async hasGame(game_id: string) {
    try {
      const p = `${this.cachePath}/games/${game_id}.json`;
      return await fs.pathExists(p);
    } catch (error) {
      throw error;
    }
  }

  async saveGame(game_id: string, data: string) {
    try {
      const p = `${this.cachePath}/games/${game_id}.json`;
      await fs.outputFile(p, data);
    } catch (error) {
      throw error;
    }
  }

  async readGame(game_id: string) {
    try {
      const p = `${this.cachePath}/games/${game_id}.json`;
      return await fs.readFile(p, "utf-8");
    } catch (error) {
      throw error;
    }
  }

  async deleteGame(game_id: string) {
    try {
      const p = `${this.cachePath}/games/${game_id}.json`;
      return await fs.remove(p);
    } catch (error) {
      throw error;
    }
  }
}
