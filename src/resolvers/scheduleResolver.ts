import "reflect-metadata";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import Schedule from '../schemas/schedule';

// @Resolver(of => Schedule)
// export default class {
//     @Query(returns => Schedule, {nullable: true})
//     scheduleBy(@Arg("season") season: number, @Arg("seasonType") seasonType: string, @Arg("week") week: number): Schedule: undefined {
//         return 
//     }
// }
