import axios from 'axios';


export async function get_ss(season: number, seasonType: string, week: number) {

    try {
        const url = `https://www.nfl.com/ajax/scorestrip?season=${season}&seasonType=${seasonType}&week=${week}`;

        const response = await axios.get(url, {
            responseType: 'text'
        });

        const parser = new DOMParser();

        // console.log(response);
        console.log(response.status)

        return parser.parseFromString(response.data, 'text/xml');

    } catch(err) {
        console.log(err)
        // throw err
    }
}
