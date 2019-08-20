import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class EspnGamePlayer {
  @PrimaryColumn()
  espn_player_id: number;
}
