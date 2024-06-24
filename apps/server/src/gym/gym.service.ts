import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Gym } from "./gym.entity";
import { TGym } from "./gym";

@Injectable()
export class GymService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Gym) private readonly gymRepository: Repository<Gym>,
    ) { }

    async getGym(id: number): Promise<TGym | null> {
        const gym = await this.gymRepository.findOne({
            where: {
                id: id
            }
        });
        gym.
    }
}
