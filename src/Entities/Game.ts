import "reflect-metadata";
import { ObjectType, Field, ID, ArgsType } from "type-graphql";
import { AggGameStat } from "./AggGameStat";
import { Entity, PrimaryColumn, Column } from "typeorm";

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
@Entity()
export class Game {
  @Field(type => ID)
  @PrimaryColumn()
  gameid: string;

  @Field({ nullable: true })
  @Column()
  // nfldb day_of_week
  wday?: string;

  // @Field({ nullable: true })
  // month?: number;

  // @Field() quarter?: string;

  // @Field() day?: number;

  @Field()
  @Column()
  season_type: string;

  @Field()
  @Column()
  finished: boolean;

  @Field()
  @Column()
  home_team: string;

  @Field()
  @Column()
  home_score: number;

  @Field()
  @Column()
  home_score_q1: number;

  @Field()
  @Column()
  home_score_q2: number;

  @Field()
  @Column()
  home_score_q3: number;

  @Field()
  @Column()
  home_score_q4: number;

  @Field()
  @Column()
  home_score_q5: number;

  @Field()
  @Column()
  home_turnovers: number;

  @Field()
  @Column()
  away_team: string;

  @Field()
  @Column()
  away_score: number;

  @Field()
  @Column()
  away_score_q1: number;

  @Field()
  @Column()
  away_score_q2: number;

  @Field()
  @Column()
  away_score_q3: number;

  @Field()
  @Column()
  away_score_q4: number;

  @Field()
  @Column()
  away_score_q5: number;

  @Field()
  @Column()
  away_turnovers: number;

  @Field()
  @Column()
  time_inserted: string;

  @Field()
  @Column()
  time_updated: string;
}
