import { getGameById, getPlayerStats, getGameStats } from '../src/nflgame/Game';

test.skip('getGame', () => {
    const id = '2018093002'
    expect.assertions(1);
    return getGameById(id).then((results) => expect(results).toEqual(true))
})

import gameResponse from './gameByIdResponse.json';


// test.skip('getGameStats', async () => {
//     expect.assertions(1)
//     return getGameStats('2012020500').then((stats) => {
//         expect(stats).toBeInstanceOf(Array)
//     })
// })
