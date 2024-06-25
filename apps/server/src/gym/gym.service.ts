import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Gym } from "./gym.entity";
import { TGym } from "./gym";
import { number } from "zod";

@Injectable()
export class GymService {
    constructor(
        @InjectRepository(Gym) private readonly gymRepository: Repository<Gym>,
    ) { }

    /**
     * 查询攀岩馆信息
     * @param id 
     * @returns 
     */
    async getGym(id: number, longitude: number, latitude: number): Promise<TGym | null> {
        const gym = await this.gymRepository.findOne({
            where: {
                id: id
            }
        });
        if (!gym) {
            Logger.error("Gym not found, id=", number);
            return null;
        }
        return {
            id: gym.id,
            name: gym.name,
            location: {
                address: gym.address,
                latitude: gym.latitude,
                longitude: gym.longitude
            },
            phone: gym.phone,
            businessHour: gym.businessHour,
            distance: calDistance(latitude, longitude, gym.latitude, gym.longitude, DISTANCE_UNIT.KM),
            //todo:add bouldernum
            boulderNum: 1,
        };
    }

    /**
     * 分页获取距离最近的攀岩馆
     * @param longitude 
     * @param latitude 
     * @param offset 
     * @param limit 
     */
    async getNearbyGymList(longitude: number, latitude: number, offset: number, limit: number): Promise<TGym[]> {
        const gyms = await this.gymRepository.createQueryBuilder("gym")
            .select("gym")
            .addSelect("ROUND(ST_Distance_Sphere(POINT(gym.longitude, gym.latitude), POINT(:longitude, :latitude) ) / 1000, 2) as distance", "distance")
            .setParameters({ longitude: longitude, latitude: latitude })
            .orderBy("distance")
            .offset(offset)
            .limit(limit)
            .getRawMany();
        const tGyms: TGym[] = [];
        gyms.forEach(gym => {
            tGyms.push({
                id: gym.id,
                name: gym.name,
                location: {
                    address: gym.address,
                    latitude: gym.latitude,
                    longitude: gym.longitude
                },
                phone: gym.phone,
                businessHour: gym.businessHour,
                distance: gym.distance.toFixed(2) + DISTANCE_UNIT.KM
            })
        });
        return tGyms;
    }

    /**
     * 获取岩馆数量
     * @returns 
     */
    async getTotalGym(): Promise<number> {
        return await this.gymRepository.count();
    }



}
