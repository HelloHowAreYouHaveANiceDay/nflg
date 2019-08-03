import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Drive {
  @PrimaryColumn()
  gsis_id: string;

  @PrimaryColumn()
  drive_id: string;

  @Column()
  start_field: string;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  pos_team: string;

  @Column()
  pos_time: string;

  @Column()
  first_downs: string;

  @Column()
  result: string;

  @Column()
  penalty_yards: string;

  @Column()
  yards_gaind: string;

  @Column()
  play_count: string;

  @Column()
  time_inserted: string;

  @Column()
  time_updated: string;
}
