import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { AuthModule } from '../auth/auth.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [AuthModule, EventModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
