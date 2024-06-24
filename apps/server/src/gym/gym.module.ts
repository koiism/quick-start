import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Gym } from "./gym.entity";
import { GymService } from "./gym.service";
import { UsersModule } from "src/user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Gym]), UsersModule],
    providers: [GymService],
    exports: [TypeOrmModule]
})
export class GymsModule { }