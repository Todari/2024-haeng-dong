import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto, UpdateMembersDto } from './member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

@Controller()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(JwtAuthGuard)
  @Post('admin/events/:token/members')
  addMembers(
    @Param('token') token: string,
    @CurrentUser('userId') userId: number,
    @Body() dto: CreateMemberDto,
  ) {
    return this.memberService.addMembers(token, userId, dto);
  }

  @Get('events/:token/members')
  findAll(@Param('token') token: string) {
    return this.memberService.findAllByEvent(token);
  }

  @Get('events/:token/members/current')
  findCurrent(@Param('token') token: string) {
    return this.memberService.findCurrentMembers(token);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/events/:token/members')
  updateMembers(
    @Param('token') token: string,
    @CurrentUser('userId') userId: number,
    @Body() dto: UpdateMembersDto,
  ) {
    return this.memberService.updateMembers(token, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/events/:token/members/:memberId')
  deleteMember(
    @Param('token') token: string,
    @Param('memberId', ParseIntPipe) memberId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.memberService.deleteMember(token, memberId, userId);
  }
}
