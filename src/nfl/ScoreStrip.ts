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
