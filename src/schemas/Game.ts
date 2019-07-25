import "reflect-metadata";
import { ObjectType, Field, ID, ArgsType } from "type-graphql";
import { AggGameStat } from "./AggGameStat";

export interface scoreDetails {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  T: number;
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

  @Field({ nullable: true })
  weather: string;

  @Field({ nullable: true })
  media: string;

  @Field()
  clock: string;

  @Field() yl: string;

  @Field() homeScore_q1: number;

  @Field() homeScore_q2: number;

  @Field() homeScore_q3: number;

  @Field() homeScore_q4: number;

  @Field() awayScore_q1: number;

  @Field() awayScore_q2: number;

  @Field() awayScore_q3: number;

  @Field() awayScore_q4: number;

  @Field(type => [AggGameStat])
  aggregatedGameStats?: AggGameStat[];
}
