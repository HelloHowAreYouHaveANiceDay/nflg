import "reflect-metadata";
import { ObjectType, Field, ID, ArgsType } from "type-graphql";

import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  UpdateDateColumn,
  CreateDateColumn
} from "typeorm";
import { Team } from "./Team";

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

  @Field()
  @Column()
  season_type: string;

  @Field()
  @Column()
  game_type: string;

  @Field()
  @Column()
  year: number;

  @Field()
  @Column()
  week: number;

  @Field()
  @Column()
  finished: boolean;

  @Field(type => Team)
  @ManyToOne(type => Team, team => team.games)
  home_team: Team;

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

  @Field(type => Team)
  @ManyToOne(type => Team, team => team.games)
  away_team: Team;

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
  @CreateDateColumn()
  time_inserted?: string;

  @Field()
  @UpdateDateColumn()
  time_updated?: string;
}
