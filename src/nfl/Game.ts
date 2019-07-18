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
        [key: string]: nflPlayerStat
    },
    rushing: {
        [key: string]: nflPlayerStat
    },
    receiving: {
        [key: string]: nflPlayerStat
    },
    fumbles: {
        [key: string]: nflPlayerStat
    },
    kicking: {
        [key: string]: nflPlayerStat
    },
    punting: {
        [key: string]: nflPlayerStat
    },
    kickret: {
        [key: string]: nflPlayerStat
    },
    puntret: {
        [key: string]: nflPlayerStat
    },
    defense: {
        [key: string]: nflPlayerStat
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

export interface nflPlayerStat {
    name: string;
    att?: number;
    comp?: number;
    yds?: number;
    tds?: number;
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

        // console.log(response);

        return response.data[eid];

    } catch (err) {
        console.log(err)
    }
}

export function getGame(nflGame: nflGameResponse) {
    let game;
    Object.keys(nflGame).forEach((key) => {
        // console.log(key)
        if (key == 'nextupdate') {
        } else {
            game = nflGame[key]
        }
    })
    return game
}