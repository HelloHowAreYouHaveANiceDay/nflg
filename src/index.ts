import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
// const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))

class Nflgame {
    teams = [
        ['ARI', 'Arizona', 'Cardinals', 'Arizona Cardinals'],
        ['ATL', 'Atlanta', 'Falcons', 'Atlanta Falcons'],
        ['BAL', 'Baltimore', 'Ravens', 'Baltimore Ravens'],
        ['BUF', 'Buffalo', 'Bills', 'Buffalo Bills'],
        ['CAR', 'Carolina', 'Panthers', 'Carolina Panthers'],
        ['CHI', 'Chicago', 'Bears', 'Chicago Bears'],
        ['CIN', 'Cincinnati', 'Bengals', 'Cincinnati Bengals'],
        ['CLE', 'Cleveland', 'Browns', 'Cleveland Browns'],
        ['DAL', 'Dallas', 'Cowboys', 'Dallas Cowboys'],
        ['DEN', 'Denver', 'Broncos', 'Denver Broncos'],
        ['DET', 'Detroit', 'Lions', 'Detroit Lions'],
        ['GB', 'Green Bay', 'Packers', 'Green Bay Packers', 'GNB'],
        ['HOU', 'Houston', 'Texans', 'Houston Texans'],
        ['IND', 'Indianapolis', 'Colts', 'Indianapolis Colts'],
        ['JAC', 'Jacksonville', 'Jaguars', 'Jacksonville Jaguars', 'JAX'],
        ['KC', 'Kansas City', 'Chiefs', 'Kansas City Chiefs', 'KAN'],
        ['LA', 'Los Angeles', 'Rams', 'Los Angeles Rams', 'LAR'],
        ['SD', 'San Diego', 'Chargers', 'San Diego Chargers', 'SDG'],
        ['LAC', 'Los Angeles C', 'Chargers', 'Los Angeles Chargers', 'LAC'],
        ['MIA', 'Miami', 'Dolphins', 'Miami Dolphins'],
        ['MIN', 'Minnesota', 'Vikings', 'Minnesota Vikings'],
        ['NE', 'New England', 'Patriots', 'New England Patriots', 'NWE'],
        ['NO', 'New Orleans', 'Saints', 'New Orleans Saints', 'NOR'],
        ['NYG', 'New York G', 'Giants', 'New York Giants'],
        ['NYJ', 'New York J', 'Jets', 'New York Jets'],
        ['OAK', 'Oakland', 'Raiders', 'Oakland Raiders'],
        ['PHI', 'Philadelphia', 'Eagles', 'Philadelphia Eagles'],
        ['PIT', 'Pittsburgh', 'Steelers', 'Pittsburgh Steelers'],
        ['SEA', 'Seattle', 'Seahawks', 'Seattle Seahawks'],
        ['SF', 'San Francisco', '49ers', 'San Francisco 49ers', 'SFO'],
        ['STL', 'St. Louis', 'Rams', 'St. Louis Rams'],
        ['TB', 'Tampa Bay', 'Buccaneers', 'Tampa Bay Buccaneers', 'TAM'],
        ['TEN', 'Tennessee', 'Titans', 'Tennessee Titans'],
        ['WAS', 'Washington', 'Redskins', 'Washington Redskins', 'WSH'],
    ]
}
