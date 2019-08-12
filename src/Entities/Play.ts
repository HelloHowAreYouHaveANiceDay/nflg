import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn
} from "typeorm";
import PlayPlayer from "./PlayPlayer";

@Entity()
export default class Play {
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

  // @Column()
  // first_down: number;
  // @Column()
  // fourth_down_att: number;
  // @Column()
  // fourth_down_conv: number;
  // @Column()
  // fourth_down_failed: number;
  // @Column()
  // passing_first_down: number;
  // @Column()
  // penalty: number;
  // @Column()
  // penalty_first_down: number;
  // @Column()
  // penalty_yds: number;
  // @Column()
  // rushing_first_down: number;
  // @Column()
  // third_down_att: number;
  // @Column()
  // third_down_conv: number;
  // @Column()
  // third_down_failed: number;
  // @Column()
  // timeout: number;
  // @Column()
  // xp_aborted: number;

  // @OneToMany(type => PlayPlayer, playplayer => playplayer.play)
  // play_players: PlayPlayer[];
}
