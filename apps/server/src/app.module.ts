import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { tRPCModule } from '@libs/trpc';
import { appRouter } from './router';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UsersModule } from './user/user.module';

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
      database: 'boulder-book',
      entities: [User],
      //synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
