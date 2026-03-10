import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { AuthModule } from '../auth/auth.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [AuthModule, EventModule],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
