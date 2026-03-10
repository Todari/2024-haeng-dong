import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('admin/events/:token/images')
  uploadImages(
    @Param('token') token: string,
    @CurrentUser('userId') userId: number,
    @Body('imageNames') imageNames: string[],
  ) {
    return this.imageService.saveImages(token, userId, imageNames);
  }

  @Get('events/:token/images')
  findImages(@Param('token') token: string) {
    return this.imageService.findImages(token);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/events/:token/images/:imageId')
  deleteImage(
    @Param('token') token: string,
    @Param('imageId', ParseIntPipe) imageId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.imageService.deleteImage(token, imageId, userId);
  }
}
