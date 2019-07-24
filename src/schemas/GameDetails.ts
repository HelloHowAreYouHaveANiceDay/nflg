import { Field, ObjectType, ID } from "type-graphql";
import { AggGameStat } from "./AggGameStat";

// ObjectType defines class as a GraphQL type
@ObjectType()
export default class GameDetails {
  //   @Field(type => ID)
  //   gameid: string;

  @Field() qtr: string;

  @Field({ nullable: true })
  note: string;

  @Field() down: number;

  @Field() togo: number;

  @Field() redzone: boolean;

  @Field() clock: string;

  @Field({ nullable: true })
  stadium: string;

  @Field() posteam: string;

  @Field({ nullable: true })
  homeShort: string;

  @Field({ nullable: true })
  awayShort: string;
}