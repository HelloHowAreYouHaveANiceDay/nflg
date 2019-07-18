import { Resolver, Query, Arg } from "type-graphql";
import Game from "../schemas/Game";
import { getGameById } from '../nfl/Game'

// @Resolver(of => Game)
// export default class {
//     @Query(returns => Game, { nullable: true })
//     async gameByid(@Arg("eid") eid: number): Promise<any> { }
// }

@Resolver()
export class GameResolver {
    @Query(returns => Game)
    async game(@Arg('id') id: number) {
        return await getGameById(id);
    }
}