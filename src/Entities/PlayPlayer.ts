import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export default class PlayPlayer {
  @PrimaryColumn()
  gsis_id: string;
  @PrimaryColumn()
  drive_id: string;
  @PrimaryColumn()
  play_id: string;
  @PrimaryColumn()
  player_id: string;

  @Column()
  team: string;
  @Column()
  defense_ast: number;
  @Column()
  defense_ffum: number;
  @Column()
  defense_fgblk: number;
  @Column()
  defense_frec: number;
  @Column()
  defense_frec_tds: number;
  @Column()
  defense_frec_yds: number;
  @Column()
  defense_int: number;
  @Column()
  defense_tds: number;
  @Column()
  defense_yds: number;
  @Column()
  defense_pass_def: number;
  @Column()
  defense_puntblk: number;
  @Column()
  defense_qbhit: number;
  @Column()
  defense_safe: number;
  @Column()
  defense_sk: number;
  @Column()
  defense_sk_yds: number;
  @Column()
  defense_tkl: number;
  @Column()
  defense_tkl_loss: number;
  @Column()
  defense_tkl_loss_yds: number;
  @Column()
  defense_tkl_primary: number;
  @Column()
  defense_xpblk: number;
  @Column()
  fumbles_forced: number;
  @Column()
  fumbles_notforced: number;
  @Column()
  fumbles_lost: number;
  @Column()
  fumbles_oob: number;
  @Column()
  fumbles_rec: number;
  @Column()
  fumbles_rec_tds: number;
  @Column()
  fumbles_rec_yds: number;
  @Column()
  fumbles_tot: number;
  @Column()
  kicking_all_yds: number;
  @Column()
  kicking_downed: number;
  @Column()
  kicking_fga: number;
  @Column()
  kicking_fgm: number;
  @Column()
  kicking_fgm_yds: number;
  @Column()
  kicking_fgmissed: number;
  @Column()
  kicking_fgmissed_yds: number;
  @Column()
  kicking_i20: number;
  @Column()
  kicking_rec: number;
  @Column()
  kicking_tot: number;
  @Column()
  kicking_rec_tds: number;
  @Column()
  kicking_touchback: number;
  @Column()
  kicking_xpa: number;
  @Column()
  kicking_xpmade: number;
  @Column()
  kicking_xpmissed: number;
  @Column()
  kicking_yds: number;
  @Column()
  kickret_fair: number;
  @Column()
  kickret_tds: number;
  @Column()
  kickret_touchback: number;
  @Column()
  kickret_yds: number;
  @Column()
  passing_att: number;
  @Column()
  passing_cmp: number;
  @Column()
  passing_cmp_air_yds: number;
  @Column()
  passing_incmp: number;
  @Column()
  passing_incmp_air_yds: number;
  @Column()
  passing_int: number;
  @Column()
  passing_sk: number;
  @Column()
  passing_sk_yds: number;
  @Column()
  passing_tds: number;
  @Column()
  passing_twopta: number;
  @Column()
  passing_twoptm: number;
  @Column()
  passing_twoptmissed: number;
  @Column()
  passing_yds: number;
  @Column()
  punting_blk: number;
  @Column()
  punting_i20: number;
  @Column()
  punting_tot: number;
  @Column()
  punting_touchback: number;
  @Column()
  punting_yds: number;
  @Column()
  puntret_downed: number;
  @Column()
  puntret_fair: number;
  @Column()
  puntret_tds: number;
  @Column()
  puntret_oob: number;
  @Column()
  puntret_tot: number;
  @Column()
  puntret_touchback: number;
  @Column()
  puntret_yds: number;
  @Column()
  receiving_rec: number;
  @Column()
  receiving_tar: number;
  @Column()
  receiving_tds: number;
  @Column()
  receiving_twopta: number;
  @Column()
  receiving_twoptm: number;
  @Column()
  receiving_twoptmissed: number;
  @Column()
  receiving_yac_yds: number;
  @Column()
  receiving_yds: number;
  @Column()
  rushing_att: number;
  @Column()
  rushing_loss: number;
  @Column()
  rushing_loss_yds: number;
  @Column()
  rushing_tds: number;
  @Column()
  rushing_twopta: number;
  @Column()
  rushing_twoptm: number;
  @Column()
  rushing_twoptmissed: number;
  @Column()
  rushing_yds: number;
}
