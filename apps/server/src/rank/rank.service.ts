import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Rank } from "./rank.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { RANK_TIME_DIMENSION, TRank } from "./rank";
import { UserService } from "src/user/user.service";

@Injectable()
export class RankService {
    constructor(
        @InjectRepository(Rank) private readonly gymRepository: Repository<Rank>,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService
    ) { }


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
        const userRank = await this.getWhereByTimeDimension(this.gymRepository.createQueryBuilder("rank")
            .select("id")
            .addSelect("SUM(rank.exp)", "exp")
            .addSelect("DENSE_RANK() OVER(ORDER BY exp DESC)", "userRank"), timeDimension)
            .getRawOne();

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