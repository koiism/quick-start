import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { tRPCModule } from '@libs/trpc';
import { appRouter } from './router';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { GymsModule } from './gym/gym.module';
import { WallsModule } from './wall/wall.module';

@Module({
  imports: [
    tRPCModule.forRoot({
      prefix: '/trpc',
      router: appRouter,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'yangyi123',
      database: 'boulder_book',
      autoLoadEntities: true,
      //synchronize: true,
    }),
    UsersModule,
    GymsModule,
    WallsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
