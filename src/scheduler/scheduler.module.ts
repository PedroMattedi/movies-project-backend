import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { MoviesModule } from '../movies/movies.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [ScheduleModule.forRoot(), MoviesModule, MailModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
