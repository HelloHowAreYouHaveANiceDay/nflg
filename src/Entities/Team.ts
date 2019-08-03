import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import Player from "./Player";

@Entity()
export default class Team {
  @PrimaryColumn()
  team_id: string;

  @Column()
  city: string;

  @Column()
  name: string;

  @OneToMany(type => Player, player => player.team)
  players: Player[];
}
