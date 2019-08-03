"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
require("reflect-metadata");
const nflgame_1 = __importDefault(require("./nflgame/nflgame"));
const typeorm_1 = require("typeorm");
nflgame_1.default.getInstance(process.env.CACHE_PATH);
// GRAPHQL PORTION
// async function bootstrap() {
//   const schema = await buildSchema({
//     resolvers: [AggGameStatResolver, PlayerResolver, GameResolver],
//     validate: false,
//     emitSchemaFile: true
//   });
//   const server = new GraphQLServer({
//     schema
//   });
//   server.start(() => console.log("Server is running on http://localhost:4000"));
// }
// bootstrap();
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield typeorm_1.createConnection();
        console.log(connection);
    });
}
connect();
// HRM
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => console.log("Module disposed. "));
}
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
//# sourceMappingURL=index.js.map