
const Players = require('../data/nflPlayers.json');
// const Players = JSON.parse('./nflPlayers.json')

// export function getIdFromUrl(url: string) {
//     //@ts-ignore
//     return url.match(/([0-9]+)/)[0]
// }

// interface nflPlayer {
//     player_id: string;
//     number: string;
//     fullName: string;
//     firstName: string;
//     lastName: string;
//     position: string;
//     status: string;
//     height: string;
//     weight: string;
//     birthdate: string;
//     experience: string;
//     college: string;
// }

export function getPlayerById(playerId: string) {

    const p= Players[playerId]
    if (p) {
        p.playerId = playerId;
        return p
    } else {
        return null
    }

}


export function updatePlayers() {
    const gsis_profile_url = 'https://www.nfl.com/players/profile?id='
    const roster = 'https://www.nfl.com/teams/rostjer?team='
    // TODO: implement player update before season begins
    // https://github.com/derek-adair/nflgame/blob/master/nflgame/update_players.py

    //1. Load dictionary mapping GSIS id to a dict of player metadata

    //2. build a reverse map from profile id to gsis id

    //3. find all players who participated in the last week of play

    //4. if player is not in mapping then player is added to update list

    //5. 
}