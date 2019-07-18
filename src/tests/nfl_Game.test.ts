import { getGameById } from '../nfl/Game';

test('getGame', () => {
    const id = 2018093002
    expect.assertions(1);
    return getGameById(id).then((results) => expect(results).toEqual(true))
})