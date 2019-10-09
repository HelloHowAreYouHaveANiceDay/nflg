import { Connection } from "typeorm";

export default class NFL {
  conn: Connection;
  constructor(conn: Connection) {
    this.conn = conn;
  }
  start() {
    // get latest week from api
    // get latest week from db
    // set update parameters
    // instantiate update array with historic games that need to be updated
    // start loop
    //  update game
    //      start transaction
    //      retrieve game details
    //      parse game details
    //      save game details
    //      if game is unfinished, push game back into update array
    //      end transaction
    // end loop when update array is empty
  }

  stop() {
    // stop loop
  }
}
