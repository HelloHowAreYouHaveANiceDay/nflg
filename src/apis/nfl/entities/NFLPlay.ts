import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn
} from "typeorm";

@Entity()
export class NFLPlay {
  @PrimaryColumn()
  game_id: string;
  @PrimaryColumn()
  drive_id: string;
  @PrimaryColumn()
  play_id: string;

  @Column()
  time: string;
  @Column()
  pos_team: string;
  @Column({ nullable: true })
  yardline: number;
  @Column()
  down: number;
  @Column()
  yards_to_go: number;
  @Column()
  description: string;
  @Column({ nullable: true })
  note: string;
  @CreateDateColumn()
  time_inserted?: string;
  @UpdateDateColumn()
  time_updated?: string;
}
