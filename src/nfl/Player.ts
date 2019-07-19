const gsis_profile_url = 'https://www.nfl.com/players/profile?id='
const roster = 'https://www.nfl.com/teams/roster?team='

const Players = require('./nflPlayers.json');
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

    const player = Players[playerId]
    if (player) {
        player.playerId = playerId;
        return player
    } else {
        return null
    }

}
