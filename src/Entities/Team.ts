import "reflect-metadata";
import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import Player from "./Player";
import { Game } from "./Game";

@Entity()
export class Team {
  @PrimaryColumn()
  team_id: string;

  @Column()
  city: string;

  @Column()
  name: string;

  // @OneToMany(type => Player, player => player.team)
  // players?: Player[];

  // @OneToMany(type => Game, game => game.home_team)
  // @OneToMany(type => Game, game => game.away_team)
  // games?: Game[];
}

// NFL teams changeup all the time. need to figure out a team update function.
// Lookup is being used now.
export const teamLookup = {
  ARI: ["Arizona", "Cardinals", "Arizona Cardinals"],
  ATL: ["Atlanta", "Falcons", "Atlanta Falcons"],
  BAL: ["Baltimore", "Ravens", "Baltimore Ravens"],
  BUF: ["Buffalo", "Bills", "Buffalo Bills"],
  CAR: ["Carolina", "Panthers", "Carolina Panthers"],
  CHI: ["Chicago", "Bears", "Chicago Bears"],
  CIN: ["Cincinnati", "Bengals", "Cincinnati Bengals"],
  CLE: ["Cleveland", "Browns", "Cleveland Browns"],
  DAL: ["Dallas", "Cowboys", "Dallas Cowboys"],
  DEN: ["Denver", "Broncos", "Denver Broncos"],
  DET: ["Detroit", "Lions", "Detroit Lions"],
  GB: ["Green Bay", "Packers", "Green Bay Packers", "G.B.", "GNB"],
  HOU: ["Houston", "Texans", "Houston Texans"],
  IND: ["Indianapolis", "Colts", "Indianapolis Colts"],
  JAC: ["Jacksonville", "Jaguars", "Jacksonville Jaguars", "JAX"],
  KC: ["Kansas City", "Chiefs", "Kansas City Chiefs", "K.C.", "KAN"],
  MIA: ["Miami", "Dolphins", "Miami Dolphins"],
  MIN: ["Minnesota", "Vikings", "Minnesota Vikings"],
  NE: ["New England", "Patriots", "New England Patriots", "N.E.", "NWE"],
  NO: ["New Orleans", "Saints", "New Orleans Saints", "N.O.", "NOR"],
  NYG: ["New York", "Giants", "New York Giants", "N.Y.G."],
  NYJ: ["New York", "Jets", "New York Jets", "N.Y.J."],
  OAK: ["Oakland", "Raiders", "Oakland Raiders"],
  PHI: ["Philadelphia", "Eagles", "Philadelphia Eagles"],
  PIT: ["Pittsburgh", "Steelers", "Pittsburgh Steelers"],
  LAC: [
    "Los Angeles",
    "Chargers",
    "SD",
    "Los Angeles Chargers",
    "San Diego",
    "San Diego Chargers",
    "S.D.",
    "SDG"
  ],
  SEA: ["Seattle", "Seahawks", "Seattle Seahawks"],
  SF: ["San Francisco", "49ers", "San Francisco 49ers", "S.F.", "SFO"],
  LA: [
    "Los Angeles",
    "Rams",
    "Los Angeles Rams",
    "L.A.",
    "St. Louis",
    "St. Louis Rams",
    "STL",
    "S.T.L."
  ],
  TB: ["Tampa Bay", "Buccaneers", "Tampa Bay Buccaneers", "T.B.", "TAM"],
  TEN: ["Tennessee", "Titans", "Tennessee Titans"],
  WAS: ["Washington", "Redskins", "Washington Redskins", "WSH"],
  UNK: ["UNK", "UNK"]
};
