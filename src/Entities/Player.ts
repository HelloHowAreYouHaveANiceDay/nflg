import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export default class Player {
  @Field(type => ID)
  @PrimaryColumn()
  player_id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  first_name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  short_name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  last_name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  full_name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  college?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  // in inches
  height?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  // nfldb: uniform_number
  number?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  position?: string;

  @Field()
  @Column({ nullable: true })
  gsisId?: string;

  @Field()
  @Column({ nullable: true })
  profile_id?: string;

  @Field()
  @Column({ nullable: true })
  profile_url?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  birthdate?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  birthcity?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  weight?: number;

  // @Field(type => Team)
  // @ManyToOne(type => Team, team => team.players)
  // team?: Team;

  // @ManyToOne(type => PlayPlayer, playplayer => playplayer.player)
  // play_players?: PlayPlayer[];
}
