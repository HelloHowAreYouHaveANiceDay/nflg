import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Drive {
  @PrimaryColumn()
  game_id: string;

  @PrimaryColumn()
  drive_id: string;

  @Column()
  start_field: number;

  // end of game drive sometimes has no end position
  @Column({
    nullable: true
  })
  end_field: number;

  @Column()
  start_time: string;

  @Column()
  start_qtr: number;

  @Column()
  end_qtr: number;

  @Column()
  end_time: string;

  @Column()
  pos_team: string;

  @Column()
  pos_time: string;

  @Column()
  first_downs: number;

  @Column()
  result: string;

  @Column()
  penalty_yards: number;

  @Column()
  yards_gained: number;

  @Column()
  play_count: number;

  @CreateDateColumn()
  time_inserted?: string;

  @UpdateDateColumn()
  time_updated?: string;
}
