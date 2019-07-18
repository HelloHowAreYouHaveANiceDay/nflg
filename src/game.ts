const _get_json_data = async (eid: number) => {
    const url = `http://www.nfl.com/liveupdate/game-center/${eid}/${eid}_gtd.json`
    return await fetch(url)
}