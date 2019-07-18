import axios from 'axios';
import * as convert from 'xml-js'

interface xml_ss extends convert.ElementCompact{
    _declaration: {
        _attributes: {
            encoding: string,
            version: string
        }
    },
    ss: {
        gms: {
            _attributes: {
                gd: number,
                t: string,
                w: string,
                y: string
            },
            g: xml_game[]
        }
    }
}

interface xml_game {
    _attributes: {
        d: string;
        eid: number;
        ga: string;
        gsis: number;
        gt: "REG" | "POST" | "PRE";
        h: string;
        hnn: string;
        hs: number;
        k: string;
        p: string;
        q: string;
        rz: string;
        t: string;
        v: string;
        vnn: string;
        vs: number;
    }
}


export async function get_ss(season: number, seasonType: string, week: number) {

    try {
        const url = `https://www.nfl.com/ajax/scorestrip?season=${season}&seasonType=${seasonType}&week=${week}`;

        const response = await axios.get(url, {
            responseType: 'text'
        });

        // console.log(response);
        // console.log(response.data)

        const data = convert.xml2js(response.data, { compact: true }) as xml_ss

        // console.log(data)

        const games = data.ss.gms.g.map((e: xml_game) => {
            return e._attributes
        });

        return games;

    } catch (err) {
        console.log(err)
        // throw err
    }
}
