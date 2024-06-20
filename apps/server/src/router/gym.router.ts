import { procedure, router } from "@libs/trpc";
import { z } from "zod";

type TGym = {
    id: bigint,
    name: string,
    address: string,
    phone: string,
    distance: number,
    boulderNum: number,
};


export const GymRouter = router({
    gym: router({
        //  查询附近的攀岩馆列表
        list: procedure.input(
            z.object({
                latitude: z.number(),
                longitude: z.number(),
            })
        ).query(async ({ input }) => {
            const result: Array<TGym> = [];
            return result;
        }),

        // 查询最近的攀岩馆
        near: procedure.input(
            z.object({
                latitude: z.number(),
                longitude: z.number(),
            })
        ).query(async ({ input }) => {
            const result: TGym = {};
            return result;
        }),

        //  查询攀岩馆详情
        detail: procedure.input(z.object({
            id: z.bigint()
        })).query(async ({ input }) => {
            const result: TGym = { id: input.id };
            return result;
        }),


    })
});