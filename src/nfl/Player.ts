const gsis_profile_url = 'https://www.nfl.com/players/profile?id='
const roster = 'https://www.nfl.com/teams/roster?team='

export function getIdFromUrl(url: string) {
    //@ts-ignore
    return url.match(/([0-9]+)/)[0]
}

interface nflPlayer {
    player_id: string;
    number: string;
    fullName: string;
    firstName: string;
    lastName: string;
    position: string;
    status: string;
    height: string;
    weight: string;
    birthdate: string;
    experience: string;
    college: string;
}