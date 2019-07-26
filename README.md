# GraphNFL

GraphNFL is a wrapper around the NFL.com api. This project is based heavily on [BurntSushi/nflgame](https://github.com/BurntSushi/nflgame) and the maintained fork at [derek-adair/nflgame](https://github.com/derek-adair/nflgame). It's currently **in development**.

This project combines the extraction and JSON features of nflgame with GraphQL's data querying and exploration features. This is mostly due to the fact that I didn't want to rewrite the combinatory logic of nflgame. With GraphQL, this should be able to be done on the client side.

To run the project as it stands now, clone it locally and run:

``` code
yarn

yarn build

yarn start
```
s