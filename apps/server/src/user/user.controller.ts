import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users/mine')
  getMyInfo(@CurrentUser('userId') userId: number) {
    return this.userService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users')
  updateUser(
    @CurrentUser('userId') userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users')
  deleteUser(@CurrentUser('userId') userId: number) {
    return this.userService.deleteUser(userId);
  }
}
