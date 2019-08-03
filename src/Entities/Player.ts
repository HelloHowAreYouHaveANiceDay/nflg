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

  //   @Field({ nullable: true })
  //   age: number;

  @Field({ nullable: true })
  @Column()
  college: string;

  @Field({ nullable: true })
  @Column()
  // in inches
  height: number;

  @Field({ nullable: true })
  @Column()
  // nfldb: uniform_number
  number: number;

  @Field({ nullable: true })
  @Column()
  position: string;

  @Field()
  @Column()
  gsisId: string;

  @Field()
  @Column()
  profile_id: string;

  @Field()
  @Column()
  profile_url: string;

  @Field()
  @Column()
  birthdate: string;

  @Field({ nullable: true })
  @Column()
  birthcity: string;

  @Field({ nullable: true })
  @Column()
  status?: string;

  @Field({ nullable: true })
  @Column()
  weight: number;

  @Field({ nullable: true })
  @Column()
  yearsPro?: number;

  @Field(type => Team)
  @ManyToOne(type => Team, team => team.players)
  team: Team;

  @ManyToOne(type => PlayPlayer, playplayer => playplayer.player)
  play_players: PlayPlayer[];
}
