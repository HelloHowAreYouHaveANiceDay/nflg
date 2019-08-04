require("dotenv").config();
import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import AggGameStatResolver from "./resolvers/AggGameStatResolver";
import PlayerResolver from "./resolvers/PlayerResolver";
import GameResolver from "./resolvers/GameResolver";
import path from "path";

import nflGame from "./nflgame/nflgame";
import { createConnection } from "typeorm";
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
  await nfldb.setup();
  await nfldb.connection.synchronize();
  // await nfldb.setupTeams();
  const team = await nfldb.findTeam("Giants");
  const insert = await nfldb._insertGame("2019010600");
  console.log(team);
  // const connection = await createConnection();
  // console.log(connection);
}

connect();

// HRM
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => console.log("Module disposed. "));
}
