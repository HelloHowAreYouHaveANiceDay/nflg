import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export default class EspnPlayer {
  @PrimaryColumn()
  espn_player_id: number;

  @Column({ nullable: true })
  active?: boolean;

  @Column({ nullable: true })
  rank_standard?: number;

  @Column({ nullable: true })
  auc_val_standard?: number;

  @Column({ nullable: true })
  rank_ppr?: number;

  @Column({ nullable: true })
  auc_val_ppr?: number;

  @Column({ nullable: true })
  droppable?: boolean;

  @Column({ nullable: true })
  eligiable_slots?: string;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  full_name?: string;

  @Column({ nullable: true })
  position?: string;

  @Column({ nullable: true })
  on_team?: number;

  @Column({ nullable: true })
  team?: string;

  @Column({ nullable: true })
  number?: number;

  @Column({ nullable: true })
  injured?: boolean;

  @Column({ nullable: true })
  injury_status?: string;

  @Column({ nullable: true })
  own_activity_level?: string;

  @Column({ nullable: true })
  own_auc_val_avg?: number;

  @Column({ nullable: true })
  own_auc_val_avg_change?: number;

  @Column({ nullable: true })
  own_draft_pos_avg?: number;

  @Column({ nullable: true })
  own_draft_pos_pct_change?: number;

  @Column({ nullable: true })
  own_pct?: number;

  @Column({ nullable: true })
  own_pct_changed?: number;

  @Column({ nullable: true })
  own_pct_started?: number;

  @Column({ nullable: true })
  pro_team_id?: number;

  @Column({ nullable: true })
  pos_rank?: number;

  @Column({ nullable: true })
  tot_rank?: number;

  @Column({ nullable: true })
  tot_rating?: number;

  @Column({ nullable: true })
  status?: string;
}
