import Axios from "axios";

interface nflGame {
    home: gameTeam
    away: gameTeam
    drives: {}
    scrsummary: {}
    weather: string | null
    media: string | null
    y1: string
    qtr: string
    note: string | null
    down: number
    togo: number
    redzone: boolean
    clock: string
    posteam: string
    stadium: string | null
}

interface gameTeam {
    score: {
        '1': number
        '2': number
        '3': number
        '4': number
        '5': number
        'T': number
    },
    abbr: string
    to: number
    stats: aggGameStats
    players: any | null
}

interface aggGameStats {
    passing: {
        [key: string]: nflPlayerGameStat
    },
    rushing: {
        [key: string]: nflPlayerGameStat
    },
    receiving: {
        [key: string]: nflPlayerGameStat
    },
    fumbles: {
        [key: string]: nflPlayerGameStat
    },
    kicking: {
        [key: string]: nflPlayerGameStat
    },
    punting: {
        [key: string]: nflPlayerGameStat
    },
    kickret: {
        [key: string]: nflPlayerGameStat
    },
    puntret: {
        [key: string]: nflPlayerGameStat
    },
    defense: {
        [key: string]: nflPlayerGameStat
    },
    team: {
        [key: string]: {
            totfd: number,
            totyds: number,
            pyds: number,
            ryds: number,
            pen: number,
            penyds: number,
            trnovr: number,
            pt: number,
            ptyds: number
            ptavg: number
            top: string
        }
    },
}

interface nflGameResponse {
    [key: string]: nflGame | number
}

export interface nflPlayerGameStat {
    name: string;
    att?: number;
    cmp?: number;
    yds?: number;
    tds?: number;
    rec?: number;
    ints?: number;
    lngtd?: number;
    tot?: number;
    rcv?: number;
    trcv?: number;
    lost?: number;
    lng?: number;
    twopta?: number;
    twoptm?: number;
    fgm?: number;
    fga?: number;
    fgyds?: number;
    forced?: number;
    notforced?: number;
    oob?: number;
    rec_yds?: number;
    rec_tds?: number;
    totpfg: number;
    xpmade?: number;
    xpa?: number;
    xpb?: number;
    xptot?: number;
    avg?: number;
    i20?: number;
}

export async function getGameById(eid: number) {

    try {
        const url = `https://www.nfl.com/liveupdate/game-center/${eid}/${eid}_gtd.json`;

        const response = await Axios.get(url)
        return response.data[eid];

    } catch (err) {
        console.log(err)
    }
}

export async function getGameStats(gameid: number) {
    try {
        const gameResponse = await getGameById(gameid);
        const stats = getPlayerStats(gameResponse);
        return stats
    } catch (err) {
        console.log(err)
    }
}

export function getPlayerStats(nflGame: nflGame | null) {
    if (nflGame == null) {
        return []
    } else {
        const home = nflGame.home.stats
        const away = nflGame.away.stats

        return flattenStats(home).concat(flattenStats(away))
    }

}

function flattenStats(stats: aggGameStats) {
    // verbose, but clearer. Should refactor

    const playerStats: any[] = []

    Object.keys(stats.passing).forEach((playerId) => {
        const stat = {
            playerId: playerId,
            category: 'passing',
            name: stats.passing[playerId].name,
            passing_att: stats.passing[playerId].att,
            passing_cmp: stats.passing[playerId].cmp,
            passing_yds: stats.passing[playerId].yds,
            passing_tds: stats.passing[playerId].tds,
            passing_ints: stats.passing[playerId].ints,
            passing_twopta: stats.passing[playerId].twopta,
            passing_twoptm: stats.passing[playerId].twoptm,
        }
        playerStats.push(stat);
    });

    Object.keys(stats.rushing).forEach((playerId) => {
        const stat = {
            playerId: playerId,
            category: 'rushing',
            name: stats.rushing[playerId].name,
            rushing_att: stats.rushing[playerId].att,
            rushing_yds: stats.rushing[playerId].yds,
            rushing_tds: stats.rushing[playerId].tds,
            rushing_lng: stats.rushing[playerId].lng,
            rushing_lngtd: stats.rushing[playerId].lngtd,
            rushing_twopta: stats.rushing[playerId].twopta,
            rushing_twoptm: stats.rushing[playerId].twoptm,
        }
        playerStats.push(stat);
    });

    Object.keys(stats.receiving).forEach((playerId) => {
        const stat = {
            playerId: playerId,
            category: 'receiving',
            name: stats.receiving[playerId].name,
            receiving_rec: stats.receiving[playerId].rec,
            receiving_yds: stats.receiving[playerId].yds,
            receiving_tds: stats.receiving[playerId].tds,
            receiving_lng: stats.receiving[playerId].lng,
            receiving_lngtd: stats.receiving[playerId].lngtd,
            receiving_twopta: stats.receiving[playerId].twopta,
            receiving_twoptm: stats.receiving[playerId].twoptm,
        }
        playerStats.push(stat);
    });

    Object.keys(stats.fumbles).forEach((playerId) => {
        const stat = {
            playerId: playerId,
            category: 'fumbles',
            name: stats.fumbles[playerId].name,
            fumbles_forced: stats.fumbles[playerId].forced,
            fumbles_lost: stats.fumbles[playerId].lost,
            fumbles_notforced: stats.fumbles[playerId].notforced,
            fumbles_oob: stats.fumbles[playerId].oob,
            fumbles_rec: stats.fumbles[playerId].rec,
            fumbles_rec_yds: stats.fumbles[playerId].rec_yds,
            fumbles_tot: stats.fumbles[playerId].tot,
            fumbles_rec_tds: stats.fumbles[playerId].rec_tds,
        }
        playerStats.push(stat);
    });

    return playerStats;
}