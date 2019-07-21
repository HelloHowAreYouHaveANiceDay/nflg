import fs from 'fs-extra';
import { nflApiGame, nflApiGameResponse } from '../schemas/nflApiGame';

export default class jsonCache {
    folderpath: string;


    constructor(filepath: string) {
        this.folderpath = filepath;
    }

    getAbsPath() {

    }

    // get list of games
    async getSchedule() {
        const schedulePath = `${this.folderpath}/s_master.json`
        const exists = await fs.pathExists(schedulePath);
        if (exists) {
            try {
                const schedule = await fs.readJSON(schedulePath)
                return schedule;
            } catch (err) {
                // json read unsuccessful
                console.error(err)
                return [];
            }
        } else {
            // path or file does not exist at all
            console.log('path does not exist')
            return [];
        }

    }

    // get list of players
    async getPlayerList() {
        const playerPath = `${this.folderpath}/p_master.json`
        const exists = await fs.pathExists(playerPath);
        if (exists) {
            const players = await fs.readJSON(playerPath);
            return players
        }
    }

    // save list of players
    async savePlayerList() {

    }

    // retrieve a game from the cache
    async getGame(gameid: string) {
        try {
            const game = await fs.readJSON(`${this.folderpath}/${gameid}.json`)
            return game
        } catch (error) {
            return false;
        }
    }

    // save a game to the cache
    async saveGame(gameid: string, data: nflApiGame) {
        try {
            await fs.outputJSON(`${this.folderpath}/${gameid}.json`, data);
            return true;
        } catch (err) {
            console.log(err)
            return false;
        }
    }
}