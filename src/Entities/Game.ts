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
  game_id: string;

  @Field({ nullable: true })
  @Column()
  // nfldb day_of_week
  weekday: string;

  @Field()
  @Column()
  season_type: string;

  @Field()
  @Column({ nullable: true })
  game_type: string;

  @Field()
  @Column({ nullable: true })
  quarter?: string;

  @Field()
  @Column({ nullable: true })
  year: number;

  @Field()
  @Column({ nullable: true })
  week: number;

  @Field()
  @Column({ nullable: true })
  time?: string;

  @Field()
  @Column({ nullable: true })
  finished?: boolean;

  @Field(type => Team)
  @Column()
  home_team_id: string;

  @Field()
  @Column()
  home_total_score: number;

  @Field()
  @Column({ nullable: true })
  home_score_q1?: number;

  @Field()
  @Column({ nullable: true })
  home_score_q2?: number;

  @Field()
  @Column({ nullable: true })
  home_score_q3?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  home_score_q4?: number;

  @Field()
  @Column({ nullable: true })
  home_score_q5?: number;

  @Field()
  @Column({ nullable: true })
  home_turnovers?: number;

  @Field(type => Team)
  @Column()
  away_team_id?: string;

  @Field()
  @Column({ nullable: true })
  away_total_score?: number;

  @Field()
  @Column({ nullable: true })
  away_score_q1?: number;

  @Field()
  @Column({ nullable: true })
  away_score_q2?: number;

  @Field()
  @Column({ nullable: true })
  away_score_q3?: number;

  @Field()
  @Column({ nullable: true })
  away_score_q4?: number;

  @Field()
  @Column({ nullable: true })
  away_score_q5?: number;

  @Field()
  @Column({ nullable: true })
  away_turnovers?: number;

  @Field()
  @CreateDateColumn()
  time_inserted?: string;

  @Field()
  @UpdateDateColumn()
  time_updated?: string;
}
