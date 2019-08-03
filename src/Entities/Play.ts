import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export default class Play {
  @PrimaryColumn()
  gsis_id: string;
  @PrimaryColumn()
  drive_id: string;
  @PrimaryColumn()
  play_id: string;

  @Column()
  time: string;
  @Column()
  pos_team: string;
  @Column()
  yardline: string;
  @Column()
  down: number;
  @Column()
  yards_to_go: number;
  @Column()
  description: string;
  @Column()
  note: string;
  @Column()
  time_inserted: string;
  @Column()
  time_updated: string;
  @Column()
  first_down: number;
  @Column()
  fourth_down_att: number;
  @Column()
  fourth_down_conv: number;
  @Column()
  fourth_down_failed: number;
  @Column()
  passing_first_down: number;
  @Column()
  penalty: number;
  @Column()
  penalty_first_down: number;
  @Column()
  penalty_yds: number;
  @Column()
  rushing_first_down: number;
  @Column()
  third_down_att: number;
  @Column()
  third_down_conv: number;
  @Column()
  third_down_failed: number;
  @Column()
  timeout: number;
  @Column()
  xp_aborted: number;
}
