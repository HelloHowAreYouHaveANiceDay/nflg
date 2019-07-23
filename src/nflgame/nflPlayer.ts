import cheerio from 'cheerio';

export function parseProfile(html: string) {
    const $ = cheerio.load(html);
    // number and postiion only available to active players
    const numberStrip = $('span.player-number').text()
    // const playerInfo = $('div.player-info').children()
    const nameStrip = $('#playerName').attr('content');
    const playerId = $('#playerId').attr('content');
    let team = $('#playerTeam').attr('content');
    const url = $('link[rel=canonical]').attr('href')
    // const physicalRow = playerInfo.filter((i, e) => i == 2);
    // regex seems to be the easiest way to get at these specific pieces of data.
    const gsisId = html.match(/(?:GSIS ID: )\W*(\d+\W+\d+)/)![1]
    const heightStrip = html.match(/(?:<strong>)(?:Height)(?:<\/strong>)\W\s(\d+\W\d+)/)![1]
    const weightStrip = html.match(/(?:<strong>)(?:Weight)(?:<\/strong>)\W\s(\d+)/)![1]
    const ageStrip = html.match(/(?:<strong>)(?:Age)(?:<\/strong>)\W\s(\d+)/)![1]
    const birthStrip = html.match(/(?:<strong>)(?:Born)(?:<\/strong>)\W+\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(\b[a-zA-Z\s]+,[ ]?[A-Z]{2}\b)/)
    const collegeStrip = html.match(/(?:<strong>)(?:College)(?:<\/strong>)\W\s+([\w-\s]+)/)

    // console.log(numberStrip);
    let number = 0
    let position = ''

    // TODO: a lot of redundancy here.
    const firstName = nameStrip.split(' ')[0].trim()
    const lastName = nameStrip.split(' ')[1].trim()
    const fullName = `${firstName} ${lastName}`
    const birthDate = birthStrip![1]
    const birthCity = birthStrip![2]
    const weight = +weightStrip
    const college = collegeStrip![1]
    const age = +ageStrip
    const height = feetInchesToInches(heightStrip)

    if (!numberStrip) {
        team = ''
    } else {
        number = +numberStrip.match(/(\d+)/)![0]
        position = numberStrip.match(/([A-Z]+)/)![0]
    }




    return {
        fullName,
        playerId,
        team,
        firstName,
        gsisId,
        lastName,
        birthCity,
        birthDate,
        college,
        age,
        profileUrl: url,
        profileId: profileIdFromUrl(url),
        number,
        position,
        weight,
        height
    }
}

function profileIdFromUrl(url: string) {
    return url.match(/([0-9]+)/)![0];
}

function feetInchesToInches(height: string) {
    const [feet, inches] = height.split('-')
    return 12 * +feet + +inches
}