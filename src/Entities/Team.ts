import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export default class Team {
  @PrimaryColumn()
  team_id: string;

  @Column()
  city: string;

  @Column()
  name: string;
}
