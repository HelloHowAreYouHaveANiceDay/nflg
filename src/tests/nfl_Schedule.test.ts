import { getWeekSchedule, getWeeksByYearPhase} from '../nfl/Schedule';

test('get scorestrip', async () => {
    expect.assertions(1)
    return getWeekSchedule(2018, 'REG', 4).then((response) => {
        expect(response).toBeInstanceOf(Array)
    })
})


test('get list of weeks', () => {
    const weeks = getWeeksByYearPhase(2018, 'REG')

    expect(weeks.length).toEqual(18)
})