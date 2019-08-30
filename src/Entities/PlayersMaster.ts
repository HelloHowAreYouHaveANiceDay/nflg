import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class PlayersMaster {
  @PrimaryColumn()
  espn_id?: number;

  @Column({ nullable: true })
  nfl_full_name?: string;

  @Column({ nullable: true })
  nfl_id?: string;

  @Column({ nullable: true })
  nfl_pos?: string;

  @Column({ nullable: true })
  espn_full_name?: string;

  @Column({ nullable: true })
  espn_pos?: string;

  @Column({ nullable: true })
  beersheets_full_name?: string;

  @Column({ nullable: true })
  fp_full_name?: string;
}
