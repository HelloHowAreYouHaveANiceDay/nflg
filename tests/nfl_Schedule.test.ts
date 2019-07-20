import { nflSchedule, getWeeksByYearPhase } from '../src/nflgame/schedule/nflSchedule';
import path from 'path'

// test.skip('get scorestrip', async () => {
//     expect.assertions(1)
//     return getWeekSchedule(2018, 'REG', 4).then((response) => {
//         expect(response).toBeInstanceOf(Array)
//     })
// })


// test.skip('get list of weeks', () => {
//     const weeks = getWeeksByYearPhase(2018, 'REG')
//     expect(weeks.length).toEqual(17)
// })

// test.skip('ONETIME nflSchedule from nflg schedule', async () => {
//     const fpath = path.join(__dirname, '../data/nflSchedule.json')
//     const schedule = await nflSchedule.fromFile(fpath);
//     // console.log(schedule)
//     if (schedule) {
//         const resultPath = path.join(__dirname, '../data/s_master.json')
//         schedule.saveScheduleToFile(resultPath);
//     }
// })

test('initialize schedule', async () => {
    const fpath = path.join(__dirname, '../data/s_master.json');
    const schedule = await nflSchedule.fromFile(fpath)
    if(schedule){
        const games = schedule.searchSchedule({ home: 'NE', away: 'NYG', year: 2011 })
        expect(games.length).toEqual(3)
    }

})