import { parseProfile } from '../nflgame/nflPlayer';
import path from 'path'
import fs from 'fs-extra';
import Player from '../schemas/Player';


test('parse player profile', async () => {
    const page = await fs.readFile(path.join(__dirname, './profilePage.html'), 'utf-8');
    console.log(page.length);
    const willHernandez: Player = {
        firstName: 'Will',
        lastName: 'Hernandez',
        fullName: 'Will Hernandez',
        gsisId: '00-0034346',
        playerId: 'HER365408',
        profileId: '2560737',
        profileUrl: 'http://www.nfl.com/player/willhernandez/2560737/profile',
        height: 74,
        weight: 327,
        age: 23,
        birthDate: '9/2/1995',
        birthCity: 'Las Vegas , NV',
        college: 'Texas-El Paso',
        team: 'NYG',
        position: 'OG',
        number: 71,
    }
    expect(parseProfile(page)).toEqual(willHernandez)
})
