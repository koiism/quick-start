import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wall } from "./wall.entity";
import { WallService } from "./wall.service";

@Module({
    imports: [TypeOrmModule.forFeature([Wall])],
    providers: [WallService],
    exports: [TypeOrmModule]
})
export class WallsModule { }