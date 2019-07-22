import nflApi from '../nflgame/nflApi';
import _ from 'lodash'

test('week generator', async () => {
    const w1 = await nflApi.yearPhaseWeek({
        year: 2019,
        stype: 'PRE',
        week: 0
    });
    const w2 = await nflApi.yearPhaseWeek({
        year: 2011,
        stype: 'POST',
        week: 4
    });

    expect(_.first(w1)).toEqual({
        year: 2019,
        stype: 'PRE',
        week: 0
    })

    expect(_.first(w2)).toEqual({
        year: 2011,
        stype: 'POST',
        week: 4
    })
})