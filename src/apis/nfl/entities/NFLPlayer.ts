import "reflect-metadata";
import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn
} from "typeorm";
export class NFLPlayer {
  @PrimaryColumn()
  player_id: string;

  @Column({ nullable: true })
  team?: string;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  short_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  full_name?: string;

  @Column({ nullable: true })
  college?: string;

  @Column({ nullable: true })
  // in inches
  height?: number;

  @Column({ nullable: true })
  // nfldb: uniform_number
  number?: number;

  @Column({ nullable: true })
  position?: string;

  @Column({ nullable: true })
  gsisId?: string;

  @Column({ nullable: true })
  profile_id?: string;

  @Column({ nullable: true })
  profile_url?: string;

  @Column({ nullable: true })
  birthdate?: string;

  @Column({ nullable: true })
  birthcity?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  weight?: number;

  @CreateDateColumn()
  time_inserted?: string;

  @UpdateDateColumn()
  time_updated?: string;
}
