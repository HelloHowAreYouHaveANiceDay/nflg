require("dotenv").config();
import "reflect-metadata";
import { NFLdb } from "./nfldb/NFLdb";
import nflGame from "./nflgame/nflgame";

nflGame.getInstance(process.env.CACHE_PATH);

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

async function connect() {
  try {
    // await nflGame.getInstance().regenerateSchedule();
    const nfldb = new NFLdb();
    // const options = await getConnectionOptions(process.env.NODE_ENV);
    await nfldb.setup();
    await nfldb.connection.synchronize();
    await nfldb.setupTeams();
    // await nfldb.updateScheduleGames(2018);
    const g = await nfldb.updateGameDetails(2018);
    console.log(g);
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
