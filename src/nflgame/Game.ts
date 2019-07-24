import { nflApiGame, nflAggGameStats } from "../schemas/nflApiGame";
import { AggGameStat } from "../schemas/AggGameStat";
import GameDetails from "../schemas/Game";

export function getPlayerStats(nflGame: nflApiGame | null) {
    if (nflGame == null) {
        return []
    } else {
        const home = nflGame.home.stats
        const away = nflGame.away.stats
        return flattenStats(home).concat(flattenStats(away))
    }
}

function flattenStats(stats: nflAggGameStats) {
    // verbose, but clearer. Should refactor

    const playerStats: AggGameStat[] = []

    if (stats.passing) {
        Object.keys(stats.passing).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'passing',
                name: stats.passing[playerId].name,
                passing_att: stats.passing[playerId].att,
                passing_cmp: stats.passing[playerId].cmp,
                passing_yds: stats.passing[playerId].yds,
                passing_tds: stats.passing[playerId].tds,
                passing_ints: stats.passing[playerId].ints,
                passing_twopta: stats.passing[playerId].twopta,
                passing_twoptm: stats.passing[playerId].twoptm,
            }
            playerStats.push(stat);
        });
    }

    if (stats.rushing) {
        Object.keys(stats.rushing).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'rushing',
                name: stats.rushing[playerId].name,
                rushing_att: stats.rushing[playerId].att,
                rushing_yds: stats.rushing[playerId].yds,
                rushing_tds: stats.rushing[playerId].tds,
                rushing_lng: stats.rushing[playerId].lng,
                rushing_lngtd: stats.rushing[playerId].lngtd,
                rushing_twopta: stats.rushing[playerId].twopta,
                rushing_twoptm: stats.rushing[playerId].twoptm,
            }
            playerStats.push(stat);
        });
    }

    if (stats.receiving) {
        Object.keys(stats.receiving).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'receiving',
                name: stats.receiving[playerId].name,
                receiving_rec: stats.receiving[playerId].rec,
                receiving_yds: stats.receiving[playerId].yds,
                receiving_tds: stats.receiving[playerId].tds,
                receiving_lng: stats.receiving[playerId].lng,
                receiving_lngtd: stats.receiving[playerId].lngtd,
                receiving_twopta: stats.receiving[playerId].twopta,
                receiving_twoptm: stats.receiving[playerId].twoptm,
            }
            playerStats.push(stat);
        });

    }

    if (stats.fumbles) {
        Object.keys(stats.fumbles).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'fumbles',
                name: stats.fumbles[playerId].name,
                fumbles_forced: stats.fumbles[playerId].forced,
                fumbles_lost: stats.fumbles[playerId].lost,
                fumbles_notforced: stats.fumbles[playerId].notforced,
                fumbles_oob: stats.fumbles[playerId].oob,
                fumbles_rec: stats.fumbles[playerId].rec,
                fumbles_rec_yds: stats.fumbles[playerId].rec_yds,
                fumbles_tot: stats.fumbles[playerId].tot,
                fumbles_rec_tds: stats.fumbles[playerId].rec_tds,
            }
            playerStats.push(stat);
        });

    }

    if (stats.kicking) {
        Object.keys(stats.kicking).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'kicking',
                name: stats.kicking[playerId].name,
                kicking_fgm: stats.kicking[playerId].fgm,
                kicking_fga: stats.kicking[playerId].fga,
                kicking_fgyds: stats.kicking[playerId].fgyds,
                kicking_totpfg: stats.kicking[playerId].totpfg,
                kicking_xpmade: stats.kicking[playerId].xpmade,
                kicking_xpa: stats.kicking[playerId].xpa,
                kicking_xpb: stats.kicking[playerId].xpb,
                kicking_xptot: stats.kicking[playerId].xptot,
            }
            playerStats.push(stat);
        });
    }

    if (stats.punting) {
        Object.keys(stats.punting).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'punting',
                name: stats.punting[playerId].name,
                punting_pts: stats.punting[playerId].pts,
                punting_yds: stats.punting[playerId].yds,
                punting_avg: stats.punting[playerId].avg,
                punting_i20: stats.punting[playerId].i20,
                punting_lng: stats.punting[playerId].lng
            }
            playerStats.push(stat);
        });
    }

    if (stats.kickret) {
        Object.keys(stats.kickret).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'kickret',
                name: stats.kickret[playerId].name,
                kickret_ret: stats.kickret[playerId].ret,
                kickret_avg: stats.kickret[playerId].avg,
                kickret_tds: stats.kickret[playerId].tds,
                kickret_lng: stats.kickret[playerId].lng,
                kickret_lngtd: stats.kickret[playerId].lngtd
            }
            playerStats.push(stat);
        });
    }

    if (stats.puntret) {
        Object.keys(stats.puntret).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'puntret',
                name: stats.puntret[playerId].name,
                puntret_ret: stats.puntret[playerId].ret,
                puntret_avg: stats.puntret[playerId].avg,
                puntret_tds: stats.puntret[playerId].tds,
                puntret_lng: stats.puntret[playerId].lng,
                puntret_lngtd: stats.puntret[playerId].lngtd
            }
            playerStats.push(stat);
        });
    }

    if (stats.defense) {
        Object.keys(stats.defense).forEach((playerId) => {
            const stat = {
                playerId: playerId,
                category: 'defense',
                name: stats.defense[playerId].name,
                defense_tkl: stats.defense[playerId].tkl,
                defense_ast: stats.defense[playerId].ast,
                defense_sk: stats.defense[playerId].sk,
                defense_int: stats.defense[playerId].int,
                defense_ffum: stats.defense[playerId].ffum
            }
            playerStats.push(stat);
        });
    }


    return playerStats;
}

export function parseGame(g: nflApiGame): GameDetails {
    const game: GameDetails = {
        weather: g.weather ? g.weather : '',
        media: g.media ? g.media : '',
        yl: g.yl,
        qtr: g.qtr,
        note: g.note ? g.note : '',
        down: g.down,
        togo: g.togo,
        redzone: g.redzone,
        clock: g.clock,
        posteam: g.posteam,
        stadium: g.stadium ? g.stadium : '',
        homeShort: g.home.abbr,
        awayShort: g.away.abbr
    }

    return game;
}

export function gamesGen(year: number, week?: number, home?: string, away?: string, kind = 'REG', started = false) {
    /*
    games returns a generator of all games matching the given criteria. Each
    game can then be queried for player statistics and information about
    the game itself (score, winner, scoring plays, etc.).

    As a special case, if the home and away teams are set to the same team,
    then all games where that team played are returned.

    The kind parameter specifies whether to fetch preseason, regular season
    or postseason games. Valid values are PRE, REG and POST.

    The week parameter is relative to the value of the kind parameter, and
    may be set to a list of week numbers.

    In the regular season, the week parameter corresponds to the normal
    week numbers 1 through 17. Similarly in the preseason, valid week numbers
    are 1 through 4. In the post season, the week number corresponds to the
    numerical round of the playoffs. So the wild card round is week 1,
    the divisional round is week 2, the conference round is week 3
    and the Super Bowl is week 4.

    The year parameter specifies the season, and not necessarily the actual
    year that a game was played in. For example, a Super Bowl taking place
    in the year 2011 actually belongs to the 2010 season. Also, the year
    parameter may be set to a list of seasons just like the week parameter.
    Note that if a game's JSON data is not cached to disk, it is retrieved
    from the NFL web site. A game's JSON data is *only* cached to disk once
    the game is over, so be careful with the number of times you call this
    while a game is going on. (i.e., don't piss off NFL.com.)

    If started is True, then only games that have already started (or are
    about to start in less than 5 minutes) will be returned. Note that the
    started parameter requires pytz to be installed. This is useful when
    you only want to collect stats from games that have JSON data available
    (as opposed to waiting for a 404 error from NFL.com).
    */
}