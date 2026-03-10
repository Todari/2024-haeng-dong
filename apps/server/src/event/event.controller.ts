import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, CreateGuestEventDto, UpdateEventDto } from './event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('events/guest')
  createGuestEvent(@Body() dto: CreateGuestEventDto) {
    return this.eventService.createGuestEvent(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('events')
  createEvent(
    @Body() dto: CreateEventDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.eventService.createEvent(dto, userId);
  }

  @Get('events/:token')
  findEvent(@Param('token') token: string) {
    return this.eventService.findByToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('events/mine')
  findMyEvents(@CurrentUser('userId') userId: number) {
    return this.eventService.findMyEvents(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/events/:token')
  updateEvent(
    @Param('token') token: string,
    @CurrentUser('userId') userId: number,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventService.update(token, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('events')
  deleteEvents(
    @Body('eventIds') eventIds: string[],
    @CurrentUser('userId') userId: number,
  ) {
    return this.eventService.deleteEvents(eventIds, userId);
  }
}
