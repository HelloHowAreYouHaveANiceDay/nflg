import { getGameById, getGame } from '../src/nfl/Game';

test.skip('getGame', () => {
    const id = 2018093002
    expect.assertions(1);
    return getGameById(id).then((results) => expect(results).toEqual(true))
})

import gameResponse from './gameByIdResponse.json';

test('extract game component from response', () => {
    const game = getGame(gameResponse)
    expect(game).toEqual(gameResponse['2012020500'])
})