import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Gym } from "./gym.entity";
import { TGym } from "./gym";
import { number } from "zod";

@Injectable()
export class GymService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Gym) private readonly gymRepository: Repository<Gym>,
    ) { }

    /**
     * 查询攀岩馆信息
     * @param id 
     * @returns 
     */
    async getGym(id: number): Promise<TGym | null> {
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
            boulderNum: 1,
            distance: "0.5km",
        };

    }
}
