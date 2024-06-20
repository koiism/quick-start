import { procedure, router } from "@libs/trpc";
import { z } from "zod";

enum ROUTE_LEVEL {
    v0,
    V1,
    V2,
}

type TRoute = {
    id: bigint;
    name: string;
    description: string;
    gymId: string;
    routeLevel: ROUTE_LEVEL;
    finishNum: number;

}


export const RouteRouter = router({
    route: router({
        // 获取最受欢迎的线路
        popularRoute: procedure.input(
            z.object({ gymId: z.string(), }))
            .query(async ({ input, ctx }) => { }
            ),

        list:
    })
})