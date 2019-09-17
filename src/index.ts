require("dotenv").config();
import "reflect-metadata";
import { NFLdb } from "./nfldb/NFLdb";

// nflGame.getInstance(process.env.CACHE_PATH);

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

//@ts-ignore;
import EspnApi from "./apis/espn/espnApi";

async function connect() {
  try {
    // await nflGame.getInstance().regenerateSchedule();
    const nfldb = new NFLdb({
      //@ts-ignore
      leagueId: process.env.LEAGUEID,
      espns2: process.env.ESPN_S2,
      swid: process.env.SWID
    });
    // const options = await getConnectionOptions(process.env.NODE_ENV);
    await nfldb.setup();
    await nfldb.connection.synchronize();

    // await nfldb.updateAllEspnPlayers();
    // await nfldb.updateEspnFantasyTeams();
    // await nfldb.matchEspnNflPlayers();

    // await nfldb.setupTeams();
    await nfldb.updateScheduleGames(2019);
    // await nfldb.updateCurrentGames();
    // await nfldb.updateGameDetailsByConfig({
    //   year: 2019,
    //   week: 2,
    //   season_type: "REG"
    // });
    // await nfldb.updateStubPlayers();
    // console.log(g);
  } catch (error) {
    throw error;
  }
}

connect();

// HRM
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => console.log("Module disposed. "));
}
