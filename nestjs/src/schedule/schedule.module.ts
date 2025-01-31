import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersNotificationsModule } from 'src/users-notifications/users-notifications.module';

@Module({
  imports: [UsersNotificationsModule, CoursesModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
