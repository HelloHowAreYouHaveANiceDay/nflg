import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export default class EspnFantasyTeam {
  @PrimaryColumn()
  owner_id: string;

  @PrimaryColumn()
  fantasy_team_id: number;

  @Column({ nullable: true })
  owner_name?: string;

  @Column({ nullable: true })
  owner_nickname?: string;

  @Column({ nullable: true })
  abbrev?: string;

  @Column({ nullable: true })
  projected_rank?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  playoff_seed?: number;

  @Column({ nullable: true })
  points?: number;

  @Column({ nullable: true })
  points_adjusted?: number;

  @Column({ nullable: true })
  points_delta?: number;

  @Column({ nullable: true })
  record_away_gb?: number;

  @Column({ nullable: true })
  record_away_losses?: number;

  @Column({ nullable: true })
  record_away_pct?: number;

  @Column({ nullable: true })
  record_away_pa?: number;

  @Column({ nullable: true })
  record_away_pf?: number;

  @Column({ nullable: true })
  record_away_streak_len?: number;

  @Column({ nullable: true })
  record_away_streak_typ?: number;

  @Column({ nullable: true })
  record_away_ties?: number;

  @Column({ nullable: true })
  record_away_wins?: number;

  @Column({ nullable: true })
  record_division_gb?: number;

  @Column({ nullable: true })
  record_division_losses?: number;

  @Column({ nullable: true })
  record_division_pct?: number;

  @Column({ nullable: true })
  record_division_pa?: number;

  @Column({ nullable: true })
  record_division_pf?: number;

  @Column({ nullable: true })
  record_division_streak_len?: number;

  @Column({ nullable: true })
  record_division_streak_typ?: number;

  @Column({ nullable: true })
  record_division_ties?: number;

  @Column({ nullable: true })
  record_division_wins?: number;

  @Column({ nullable: true })
  record_home_gb?: number;

  @Column({ nullable: true })
  record_home_losses?: number;

  @Column({ nullable: true })
  record_home_pct?: number;

  @Column({ nullable: true })
  record_home_pa?: number;

  @Column({ nullable: true })
  record_home_pf?: number;

  @Column({ nullable: true })
  record_home_streak_len?: number;

  @Column({ nullable: true })
  record_home_streak_typ?: number;

  @Column({ nullable: true })
  record_home_ties?: number;

  @Column({ nullable: true })
  record_home_wins?: number;

  @Column({ nullable: true })
  record_overall_gb?: number;

  @Column({ nullable: true })
  record_overall_losses?: number;

  @Column({ nullable: true })
  record_overall_pct?: number;

  @Column({ nullable: true })
  record_overall_pa?: number;

  @Column({ nullable: true })
  record_overall_pf?: number;

  @Column({ nullable: true })
  record_overall_streak_len?: number;

  @Column({ nullable: true })
  record_overall_streak_typ?: number;

  @Column({ nullable: true })
  record_overall_ties?: number;

  @Column({ nullable: true })
  record_overall_wins?: number;
}
