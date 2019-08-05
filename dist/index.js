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
const NFLdb_1 = require("./nfldb/NFLdb");
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
        const nfldb = new NFLdb_1.NFLdb();
        yield nfldb.setup();
        yield nfldb.connection.synchronize();
        // await nfldb.setupTeams();
        const team = yield nfldb.findTeam("Giants");
        const insert = yield nfldb._insertGame("2019010600");
        console.log(team);
        // const connection = await createConnection();
        // console.log(connection);
    });
}
connect();
// HRM
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => console.log("Module disposed. "));
}
//# sourceMappingURL=index.js.map