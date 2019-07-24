import "reflect-metadata";
import { ObjectType, Field, ID, ArgsType } from "type-graphql";
import { AggGameStat } from "./AggGameStat";

export interface scoreDetails {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "T": number;
}

@ArgsType()
export class gameSearchArgs {
  @Field({ nullable: true })
  year?: number;

  @Field({ nullable: true })
  week?: number;

  @Field({ nullable: true })
  home?: string;

  @Field({ nullable: true })
  away?: string;

  @Field({ nullable: true })
  seasonType?: string;
}

@ObjectType()
export class Game {
  @Field(type => ID)
  gameid: string;

  @Field({ nullable: true })
  wday?: string;

  @Field({ nullable: true })
  month?: number;

  @Field() quarter?: string;

  @Field() day?: number;

  @Field() gameType?: string;

  @Field() homeShort?: string;

  @Field() homeName?: string;

  @Field() homeScore?: number;

  @Field() awayShort?: string;

  @Field() awayName?: string;

  @Field() awayScore?: number;

  @Field() redzone?: boolean;

  @Field() weather: string;

  @Field({ nullable: true })
  media: string;

  @Field() yl: string;

  //   @Field() homeScoreDetails: scoreDetails;

  //   @Field() awayScoreDetails: scoreDetails;

  @Field(type => [AggGameStat], { nullable: true })
  aggregatedGameStats?: AggGameStat[];
}
