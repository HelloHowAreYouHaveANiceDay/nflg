require("dotenv").config();
import "reflect-metadata";

import nflGame from "./nflgame/nflgame";
import { NFLdb } from "./nfldb/NFLdb";

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
  const nfldb = new NFLdb();
  // const options = await getConnectionOptions(process.env.NODE_ENV);
  await nfldb.setup();
  await nfldb.connection.synchronize();
  await nfldb.setupTeams();
  const teams = await nfldb.insertGameBySchedule({ year: 2011 });
  console.log(teams);
}

connect();

// HRM
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => console.log("Module disposed. "));
}
