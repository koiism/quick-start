import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { tRPCModule } from '@libs/trpc';
import { GreetingService } from './service/greeting.service';
import { appRouter } from './router';

@Module({
  imports: [
    tRPCModule.forRoot({
      prefix: '/trpc',
      router: appRouter,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GreetingService],
})
export class AppModule {}
