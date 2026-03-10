import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { AuthModule } from '../auth/auth.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [AuthModule, EventModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
