import "reflect-metadata";
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import Play from "./Play";
import Player from "./Player";

@Entity()
export default class PlayPlayer {
  @PrimaryColumn()
  game_id: string;
  @PrimaryColumn()
  drive_id: string;
  @PrimaryColumn()
  play_id: string;
  @PrimaryColumn()
  player_id: string;

  @Column({ nullable: true })
  player_short?: string;

  @Column({ nullable: true })
  team?: string;
  @Column({ nullable: true })
  defense_ast?: number;
  @Column({ nullable: true })
  defense_ffum?: number;
  @Column({ nullable: true })
  defense_fgblk?: number;
  @Column({ nullable: true })
  defense_frec?: number;
  @Column({ nullable: true })
  defense_frec_tds?: number;
  @Column({ nullable: true })
  defense_frec_yds?: number;
  @Column({ nullable: true })
  defense_int?: number;
  @Column({ nullable: true })
  defense_tds?: number;
  @Column({ nullable: true })
  defense_yds?: number;
  @Column({ nullable: true })
  defense_pass_def?: number;
  @Column({ nullable: true })
  defense_puntblk?: number;
  @Column({ nullable: true })
  defense_qbhit?: number;
  @Column({ nullable: true })
  defense_safe?: number;
  @Column({ nullable: true })
  defense_sk?: number;
  @Column({ nullable: true })
  defense_sk_yds?: number;
  @Column({ nullable: true })
  defense_tkl?: number;
  @Column({ nullable: true })
  defense_tkl_loss?: number;
  @Column({ nullable: true })
  defense_tkl_loss_yds?: number;
  @Column({ nullable: true })
  defense_tkl_primary?: number;
  @Column({ nullable: true })
  defense_xpblk?: number;
  @Column({ nullable: true })
  fumbles_forced?: number;
  @Column({ nullable: true })
  fumbles_notforced?: number;
  @Column({ nullable: true })
  fumbles_lost?: number;
  @Column({ nullable: true })
  fumbles_oob?: number;
  @Column({ nullable: true })
  fumbles_rec?: number;
  @Column({ nullable: true })
  fumbles_rec_tds?: number;
  @Column({ nullable: true })
  fumbles_rec_yds?: number;
  @Column({ nullable: true })
  fumbles_tot?: number;
  @Column({ nullable: true })
  kicking_all_yds?: number;
  @Column({ nullable: true })
  kicking_downed?: number;
  @Column({ nullable: true })
  kicking_fga?: number;
  @Column({ nullable: true })
  kicking_fgm?: number;
  @Column({ nullable: true })
  kicking_fgm_yds?: number;
  @Column({ nullable: true })
  kicking_fgmissed?: number;
  @Column({ nullable: true })
  kicking_fgmissed_yds?: number;
  @Column({ nullable: true })
  kicking_i20?: number;
  @Column({ nullable: true })
  kicking_rec?: number;
  @Column({ nullable: true })
  kicking_tot?: number;
  @Column({ nullable: true })
  kicking_rec_tds?: number;
  @Column({ nullable: true })
  kicking_touchback?: number;
  @Column({ nullable: true })
  kicking_xpa?: number;
  @Column({ nullable: true })
  kicking_xpmade?: number;
  @Column({ nullable: true })
  kicking_xpmissed?: number;
  @Column({ nullable: true })
  kicking_yds?: number;
  @Column({ nullable: true })
  kickret_fair?: number;
  @Column({ nullable: true })
  kickret_tds?: number;
  @Column({ nullable: true })
  kickret_touchback?: number;
  @Column({ nullable: true })
  kickret_yds?: number;
  @Column({ nullable: true })
  passing_att?: number;
  @Column({ nullable: true })
  passing_cmp?: number;
  @Column({ nullable: true })
  passing_cmp_air_yds?: number;
  @Column({ nullable: true })
  passing_incmp?: number;
  @Column({ nullable: true })
  passing_incmp_air_yds?: number;
  @Column({ nullable: true })
  passing_int?: number;
  @Column({ nullable: true })
  passing_sk?: number;
  @Column({ nullable: true })
  passing_sk_yds?: number;
  @Column({ nullable: true })
  passing_tds?: number;
  @Column({ nullable: true })
  passing_twopta?: number;
  @Column({ nullable: true })
  passing_twoptm?: number;
  @Column({ nullable: true })
  passing_twoptmissed?: number;
  @Column({ nullable: true })
  passing_yds?: number;
  @Column({ nullable: true })
  punting_blk?: number;
  @Column({ nullable: true })
  punting_i20?: number;
  @Column({ nullable: true })
  punting_tot?: number;
  @Column({ nullable: true })
  punting_touchback?: number;
  @Column({ nullable: true })
  punting_yds?: number;
  @Column({ nullable: true })
  puntret_downed?: number;
  @Column({ nullable: true })
  puntret_fair?: number;
  @Column({ nullable: true })
  puntret_tds?: number;
  @Column({ nullable: true })
  puntret_oob?: number;
  @Column({ nullable: true })
  puntret_tot?: number;
  @Column({ nullable: true })
  puntret_touchback?: number;
  @Column({ nullable: true })
  puntret_yds?: number;
  @Column({ nullable: true })
  receiving_rec?: number;
  @Column({ nullable: true })
  receiving_tar?: number;
  @Column({ nullable: true })
  receiving_tds?: number;
  @Column({ nullable: true })
  receiving_twopta?: number;
  @Column({ nullable: true })
  receiving_twoptm?: number;
  @Column({ nullable: true })
  receiving_twoptmissed?: number;
  @Column({ nullable: true })
  receiving_yac_yds?: number;
  @Column({ nullable: true })
  receiving_yds?: number;
  @Column({ nullable: true })
  rushing_att?: number;
  @Column({ nullable: true })
  rushing_loss?: number;
  @Column({ nullable: true })
  rushing_loss_yds?: number;
  @Column({ nullable: true })
  rushing_tds?: number;
  @Column({ nullable: true })
  rushing_twopta?: number;
  @Column({ nullable: true })
  rushing_twoptm?: number;
  @Column({ nullable: true })
  rushing_twoptmissed?: number;
  @Column({ nullable: true })
  rushing_yds?: number;

  @CreateDateColumn()
  time_inserted?: string;

  @UpdateDateColumn()
  time_updated?: string;
  // @ManyToOne(type => Play, play => play.play_players)
  // play: Play;

  // @ManyToOne(type => Player, player => player.play_players)
  // player: Player;
}
