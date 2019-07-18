import {get_ss} from '../nfl/ScoreStrip';

test('get scorestrip', async () => {
    expect.assertions(1)
    return get_ss(2018, 'REG', 4).then(data => expect(data).toEqual(true))
})