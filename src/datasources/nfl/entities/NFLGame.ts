import "reflect-metadata";
import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn
} from "typeorm";

@Entity()
export class NFLGame {
  @PrimaryColumn()
  game_id: string;

  @Column()
  // nfldb day_of_week
  weekday?: string;

  @Column()
  season_type?: string;

  @Column({ nullable: true })
  game_type?: string;

  @Column({ nullable: true })
  quarter?: string;

  @Column({ nullable: true })
  year?: number;

  @Column({ nullable: true })
  week?: number;

  @Column({ nullable: true })
  time?: string;

  @Column({ nullable: true })
  finished?: boolean;

  @Column()
  home_team_id?: string;

  @Column()
  home_total_score?: number;

  @Column({ nullable: true })
  home_score_q1?: number;

  @Column({ nullable: true })
  home_score_q2?: number;

  @Column({ nullable: true })
  home_score_q3?: number;

  @Column({ nullable: true })
  home_score_q4?: number;

  @Column({ nullable: true })
  home_score_q5?: number;

  @Column()
  away_team_id?: string;

  @Column({ nullable: true })
  away_total_score?: number;

  @Column({ nullable: true })
  away_score_q1?: number;

  @Column({ nullable: true })
  away_score_q2?: number;

  @Column({ nullable: true })
  away_score_q3?: number;

  @Column({ nullable: true })
  away_score_q4?: number;

  @Column({ nullable: true })
  away_score_q5?: number;

  @CreateDateColumn()
  time_inserted?: string;

  @UpdateDateColumn()
  time_updated?: string;
}
