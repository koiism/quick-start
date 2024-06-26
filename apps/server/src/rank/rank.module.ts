import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rank } from "./rank.entity";
import { RankService } from "./rank.service";
import { UsersModule } from "src/user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Rank]), forwardRef(() => UsersModule)],
    providers: [RankService],
})
export class RankModule { }