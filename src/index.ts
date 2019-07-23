import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
// import { ApolloServer } from 'apollo-server';
import { buildSchema } from "type-graphql";
import GameResolver from './resolvers/GameResolver';
import AggGameStatResolver from "./resolvers/AggGameStatResolver";
import PlayerResolver from "./resolvers/PlayerResolver";
import ScheduleResolver from './resolvers/scheduleResolver';

import nflGame from './nflgame/nflgame';
import jsonCache from './nflgame/jsonCache';
import NFLApi from "./nflgame/nflApi";
import _ from "lodash";
import Axios from "axios";

// // GRAPHQL PORTION
// async function bootstrap() {
//     const schema = await buildSchema({
//         resolvers: [
//             GameResolver, 
//             AggGameStatResolver,
//             PlayerResolver,
//             ScheduleResolver
//         ],
//         // emitSchemaFile: true,
//     });



//     const server = new GraphQLServer({
//         schema,
//     });

//     server.start(() => console.log("Server is running on http://localhost:4000"));

// }

// bootstrap();


// HRM
// if (module.hot) {
//     module.hot.accept();
//     module.hot.dispose(() => console.log('Module disposed. '));
// }


const nflg = new nflGame('C:/working/nflg/data');
const jc = new jsonCache('C:/working/nflg/data');


// nflg.updateSchedule();
// jc.searchSchedule();
// nflg.getGame('2012020500');
async function getweek() {
    const response = await Axios.get('https://www.nfl.com/players/profile?id=00-0019596');
    // const week = await NFLApi.getRoster('NYG');
    // return week
    return response.data
}
(getweek().then((result) => {
    // const parsed = NFLApi.rosterParser(result);
    console.log(result)
    // console.log(_.last(result))
}));



// class Nflgame {
//     teams = [
//         ['ARI', 'Arizona', 'Cardinals', 'Arizona Cardinals'],
//         ['ATL', 'Atlanta', 'Falcons', 'Atlanta Falcons'],
//         ['BAL', 'Baltimore', 'Ravens', 'Baltimore Ravens'],
//         ['BUF', 'Buffalo', 'Bills', 'Buffalo Bills'],
//         ['CAR', 'Carolina', 'Panthers', 'Carolina Panthers'],
//         ['CHI', 'Chicago', 'Bears', 'Chicago Bears'],
//         ['CIN', 'Cincinnati', 'Bengals', 'Cincinnati Bengals'],
//         ['CLE', 'Cleveland', 'Browns', 'Cleveland Browns'],
//         ['DAL', 'Dallas', 'Cowboys', 'Dallas Cowboys'],
//         ['DEN', 'Denver', 'Broncos', 'Denver Broncos'],
//         ['DET', 'Detroit', 'Lions', 'Detroit Lions'],
//         ['GB', 'Green Bay', 'Packers', 'Green Bay Packers', 'GNB'],
//         ['HOU', 'Houston', 'Texans', 'Houston Texans'],
//         ['IND', 'Indianapolis', 'Colts', 'Indianapolis Colts'],
//         ['JAC', 'Jacksonville', 'Jaguars', 'Jacksonville Jaguars', 'JAX'],
//         ['KC', 'Kansas City', 'Chiefs', 'Kansas City Chiefs', 'KAN'],
//         ['LA', 'Los Angeles', 'Rams', 'Los Angeles Rams', 'LAR'],
//         ['SD', 'San Diego', 'Chargers', 'San Diego Chargers', 'SDG'],
//         ['LAC', 'Los Angeles C', 'Chargers', 'Los Angeles Chargers', 'LAC'],
//         ['MIA', 'Miami', 'Dolphins', 'Miami Dolphins'],
//         ['MIN', 'Minnesota', 'Vikings', 'Minnesota Vikings'],
//         ['NE', 'New England', 'Patriots', 'New England Patriots', 'NWE'],
//         ['NO', 'New Orleans', 'Saints', 'New Orleans Saints', 'NOR'],
//         ['NYG', 'New York G', 'Giants', 'New York Giants'],
//         ['NYJ', 'New York J', 'Jets', 'New York Jets'],
//         ['OAK', 'Oakland', 'Raiders', 'Oakland Raiders'],
//         ['PHI', 'Philadelphia', 'Eagles', 'Philadelphia Eagles'],
//         ['PIT', 'Pittsburgh', 'Steelers', 'Pittsburgh Steelers'],
//         ['SEA', 'Seattle', 'Seahawks', 'Seattle Seahawks'],
//         ['SF', 'San Francisco', '49ers', 'San Francisco 49ers', 'SFO'],
//         ['STL', 'St. Louis', 'Rams', 'St. Louis Rams'],
//         ['TB', 'Tampa Bay', 'Buccaneers', 'Tampa Bay Buccaneers', 'TAM'],
//         ['TEN', 'Tennessee', 'Titans', 'Tennessee Titans'],
//         ['WAS', 'Washington', 'Redskins', 'Washington Redskins', 'WSH'],
//     ]
// }

