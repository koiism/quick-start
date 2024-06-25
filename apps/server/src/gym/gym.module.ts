import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Gym } from "./gym.entity";
import { GymService } from "./gym.service";

@Module({
    imports: [TypeOrmModule.forFeature([Gym])],
    providers: [GymService],
    exports: [TypeOrmModule]
})
export class GymsModule { }