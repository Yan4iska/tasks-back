import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from "./user/user.module";
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { TimeBlockModule } from "./time-block/time-block.module";
import { TimerModule } from "./timer/timer.module";

@Module({
  controllers: [AppController],
  imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true }), TaskModule, TimeBlockModule, TimerModule, TimerModule],
  providers: [AppService]
})
export class AppModule {}
