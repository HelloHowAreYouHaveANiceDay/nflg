import { ObjectType, Field, ID } from "type-graphql";
import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Team } from "./Team";
import PlayPlayer from "./PlayPlayer";

@ObjectType()
@Entity()
export default class Player {
  @Field(type => ID)
  @PrimaryColumn()
  player_id: string;

  @Field({ nullable: true })
  @Column()
  firstName: string;

  @Field({ nullable: true })
  @Column()
  lastName: string;

  @Field({ nullable: true })
  @Column()
  fullName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  college: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  // in inches
  height: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  // nfldb: uniform_number
  number: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  position: string;

  @Field()
  @Column()
  gsisId: string;

  @Field()
  @Column({ nullable: true })
  profile_id: string;

  @Field()
  @Column({ nullable: true })
  profile_url: string;

  @Field({ nullable: true })
  @Column()
  birthdate: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  birthcity: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  @Column()
  weight: number;

  // @Field({ nullable: true })
  // @Column()
  // yearsPro?: number;

  @Field(type => Team)
  @ManyToOne(type => Team, team => team.players)
  team?: Team;

  @ManyToOne(type => PlayPlayer, playplayer => playplayer.player)
  play_players?: PlayPlayer[];
}
