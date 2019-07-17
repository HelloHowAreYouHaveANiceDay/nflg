import { Field, Int, String, ObjectType } from 'type-graphql';

@ObjectType()
export default class Schedule {
    @Field(type => [Game])
    games: Game[];
}

@ObjectType()
class Game {
    @Field(type => Int)
    eid: number;

    @Field(type => Int)
    gsis: number;

    @Field()
    d: string;
}