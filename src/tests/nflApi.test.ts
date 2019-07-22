import nflApi from '../nflgame/nflApi';
import _ from 'lodash'

test('week generator', async () => {
    const w1 = await nflApi.yearPhaseWeek();
    expect(_.first(w1)).toEqual({
        year: 2019,
        stype: 'PRE',
        week: 0
    })
})