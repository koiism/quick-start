import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Rank } from "./rank.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { RANK_TIME_DIMENSION, TRank } from "./rank";
import { UserService } from "src/user/user.service";
import * as _ from "lodash";
import { skip } from "node:test";

@Injectable()
export class RankService {
    constructor(
        @InjectRepository(Rank) private readonly gymRepository: Repository<Rank>,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService
    ) { }

    async getExpTotal(timeDimension: RANK_TIME_DIMENSION): Promise<number> {
        return this.getWhereByTimeDimension(this.gymRepository.createQueryBuilder("rank"), timeDimension).getCount();
    }


    async getExpRankList(offset: number, limit: number, timeDimension: RANK_TIME_DIMENSION): Promise<TRank[]> {
        const userRanks = await this.getWhereByTimeDimension(this.gymRepository.createQueryBuilder("rank")
            .select("userId")
            .addSelect("SUM(rank.exp)", "exp")
            .addSelect("DENSE_RANK() OVER(ORDER BY exp DESC)", "userRank"), timeDimension)
            .limit(limit)
            .offset(offset)
            .getRawMany();
        if (!userRanks) {
            return [];
        }
        const userInfoList = await this.userService.getUserInfoList(userRanks.map(obj => obj.userId));
        const userInfoMap = _.keyBy(userInfoList, "id")
        return userRanks.map(obj => {
            const user = userInfoMap[obj.userId];
            return {
                user,
                rank: obj.userRank,
                exp: obj.exp,
            }
        }).filter(obj => !obj.user);
    }


    /**
     * 获取当前用户的排名
     * @param id 
     * @param timeDimension 
     */
    async getUserExpRankById(id: number, timeDimension: RANK_TIME_DIMENSION): Promise<TRank | null> {
        const user = await this.userService.getUserInfo(id);
        if (!user) {
            return null;
        }
        const userRanks = await this.getWhereByTimeDimension(this.gymRepository.createQueryBuilder("rank")
            .select("userId")
            .addSelect("SUM(rank.exp)", "exp")
            .addSelect("DENSE_RANK() OVER(ORDER BY exp DESC)", "userRank"), timeDimension)
            .getRawMany();
        const userRank = userRanks.find(item => item.userId === id);

        if (!userRank) {
            return {
                user,
                rank: -1,
                exp: 0
            }
        }

        return {
            user,
            rank: userRank.userRank,
            exp: userRank.exp,
        }
    }

    private getWhereByTimeDimension(query: SelectQueryBuilder<Rank>, timeDimension: RANK_TIME_DIMENSION): SelectQueryBuilder<Rank> {
        const today = new Date();
        const yearQuery = query.where("YEAR(rank.createdAt) = :year", { year: today.getFullYear() });
        const monthQuery = yearQuery.andWhere("MONTH(rank.createdAt) = :month", { month: today.getMonth() + 1 });
        const dayQuery = monthQuery.andWhere("DAY(rank.createdAt) = :day", { day: today.getDate() });
        switch (timeDimension) {
            case RANK_TIME_DIMENSION.DAY: {
                return dayQuery;
            }
            case RANK_TIME_DIMENSION.MONTH: {
                return monthQuery;
            }
            case RANK_TIME_DIMENSION.YEAR: {
                return yearQuery;
            }
            case RANK_TIME_DIMENSION.ALL: {
                return query;
            }
        }
    }
}