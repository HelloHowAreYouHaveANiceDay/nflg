import fs from 'fs-extra';
import { nflApiGame, nflApiGameResponse } from '../schemas/nflApiGame';
import Game from '../schemas/Game';
import Player from '../schemas/Player';

export default class jsonCache {
    folderpath: string;


    constructor(filepath: string) {
        this.folderpath = filepath;
    }

    getAbsPath() {

    }

    // get list of games
    getSchedule() {
        const schedulePath = `${this.folderpath}/s_master.json`
        const exists = fs.pathExistsSync(schedulePath);
        if (exists) {
            try {
                const schedule: Game[] = fs.readJSONSync(schedulePath)
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

    async saveSchedule(schedule: Game[]) {
        const schedulePath = `${this.folderpath}/s_master.json`
        try {
            await fs.writeJSON(schedulePath, schedule)
            return true;
        } catch (err) {
            // console.error(err)
            throw err;
        }
    }

    // get list of players
    getPlayerList() {
        const playerPath = `${this.folderpath}/p_master.json`
        const exists = fs.pathExistsSync(playerPath);
        if (exists) {
            const players = fs.readJSONSync(playerPath);
            return players
        } else {
            return []
        }
    }

    // save list of players
    async savePlayerList(players: Player[]) {
        const playerPath = `${this.folderpath}/p_master.json`
        try {
            await fs.writeJSON(playerPath, players);
            return true
        } catch (err) {
            throw err
        }
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