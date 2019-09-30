import "reflect-metadata";
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Team {
  @PrimaryColumn()
  team_id: string;

  @Column()
  city: string;

  @Column()
  name: string;

  @CreateDateColumn()
  time_inserted?: string;

  @UpdateDateColumn()
  time_updated?: string;
}
