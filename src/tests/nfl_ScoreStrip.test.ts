import { get_ss } from '../nfl/ScoreStrip';

test('get scorestrip', async () => {
    const results = [{ "d": "Thu", "eid": "2018092700", "ga": "", "gsis": "57615", "gt": "REG", "h": "LA", "hnn": "rams", "hs": "38", "k": "", "p": "", "q": "F", "rz": "", "t": "8:20", "v": "MIN", "vnn": "vikings", "vs": "31" }, { "d": "Sun", "eid": "2018093005", "ga": "", "gsis": "57621", "gt": "REG", "h": "JAX", "hnn": "jaguars", "hs": "31", "k": "", "p": "", "q": "F", "rz": "", "t": "1:00", "v": "NYJ", "vnn": "jets", "vs": "12" }, { "d": "Sun", "eid": "2018093006", "ga": "", "gsis": "57622", "gt": "REG", "h": "NE", "hnn": "patriots", "hs": "38", "k": "", "p": "", "q": "F", "rz": "", "t": "1:00", "v": "MIA", "vnn": "dolphins", "vs": "7" }, { "d": "Sun", "eid": "2018093007", "ga": "", "gsis": "57623", "gt": "REG", "h": "TEN", "hnn": "titans", "hs": "26", "k": "", "p": "", "q": "FO", "rz": "", "t": "1:00", "v": "PHI", "vnn": "eagles", "vs": "23" }, {
        "d": "Sun", "eid": "2018093000", "ga": "", "gsis": "57616", "gt": "REG", "h": "ATL", "hnn": "falcons", "hs": "36", "k": "", "p": "", "q": "F", "rz": "", "t": "1:00", "v": "CIN", "vnn": "bengals",
        "vs": "37"
    }, { "d": "Sun", "eid": "2018093001", "ga": "", "gsis": "57617", "gt": "REG", "h": "CHI", "hnn": "bears", "hs": "48", "k": "", "p": "", "q": "F", "rz": "", "t": "1:00", "v": "TB", "vnn": "buccaneers", "vs": "10" }, {
        "d": "Sun", "eid": "2018093002", "ga": "", "gsis": "57618", "gt": "REG", "h": "DAL", "hnn": "cowboys", "hs": "26", "k": "",
        "p": "", "q": "F", "rz": "", "t": "1:00", "v": "DET", "vnn": "lions", "vs": "24"
    }, {
        "d": "Sun", "eid": "2018093003", "ga": "", "gsis": "57619", "gt": "REG", "h": "GB", "hnn": "packers", "hs": "22", "k": "", "p": "", "q": "F", "rz":
            "", "t": "1:00", "v": "BUF", "vnn": "bills", "vs": "0"
    }, { "d": "Sun", "eid": "2018093004", "ga": "", "gsis": "57620", "gt": "REG", "h": "IND", "hnn": "colts", "hs": "34", "k": "", "p": "", "q": "FO", "rz": "", "t": "1:00", "v": "HOU", "vnn": "texans", "vs": "37" }, { "d": "Sun", "eid": "2018093008", "ga": "", "gsis": "57624", "gt": "REG", "h": "ARI", "hnn": "cardinals", "hs": "17", "k": "", "p": "", "q": "F", "rz": "", "t": "4:05", "v": "SEA", "vnn": "seahawks", "vs": "20" }, { "d": "Sun", "eid": "2018093009", "ga": "", "gsis": "57625", "gt": "REG", "h": "OAK", "hnn": "raiders", "hs": "45", "k": "", "p": "", "q": "FO", "rz": "", "t": "4:05", "v": "CLE", "vnn": "browns", "vs": "42" }, { "d": "Sun", "eid": "2018093010", "ga": "", "gsis": "57626", "gt": "REG", "h": "LAC", "hnn": "chargers", "hs": "29", "k": "", "p": "", "q": "F", "rz": "", "t": "4:25", "v": "SF", "vnn": "49ers", "vs": "27" }, { "d": "Sun", "eid": "2018093011", "ga": "", "gsis": "57627", "gt": "REG", "h": "NYG", "hnn": "giants", "hs": "18", "k": "", "p": "", "q": "F", "rz": "", "t": "4:25", "v": "NO", "vnn": "saints", "vs": "33" }, {
        "d": "Sun", "eid": "2018093012", "ga": "", "gsis": "57628", "gt": "REG", "h": "PIT", "hnn": "steelers", "hs": "14", "k": "", "p": "", "q": "F", "rz": "", "t": "8:20", "v":
            "BAL", "vnn": "ravens", "vs": "26"
    }, {
        "d": "Mon", "eid": "2018100100", "ga": "", "gsis": "57629", "gt": "REG", "h":
            "DEN", "hnn": "broncos", "hs": "23", "k": "", "p": "", "q": "F", "rz": "", "t": "8:15", "v": "KC", "vnn": "chiefs",
        "vs": "27"
    }]

    expect.assertions(1)
    return get_ss(2018, 'REG', 4).then(data => expect(data).toEqual(results))
})