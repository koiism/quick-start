import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wall } from "./wall.entity";
import { Repository } from "typeorm";
import { TWall } from "./wall";

@Injectable()
export class WallService {
    constructor(
        @InjectRepository(Wall)
        private readonly wallRepository: Repository<Wall>,
    ) { }

    async getAllByGymId(gymId: number): Promise<TWall[]> {
        return this.wallRepository.find({ select: ["id", "name", "gymId", "img"], where: { gymId } });
    }

    async save(wall: TWall): Promise<TWall> {
        const { id, name, img, gymId } = await this.wallRepository.save(wall);
        return { id, name, gymId, img };
    }
}