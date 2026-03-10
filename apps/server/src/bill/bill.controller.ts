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
import { BillService } from './bill.service';
import { CreateBillDto, UpdateBillDto, UpdateBillDetailsDto } from './bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

@Controller()
export class BillController {
  constructor(private readonly billService: BillService) {}

  @UseGuards(JwtAuthGuard)
  @Post('admin/events/:token/bills')
  create(
    @Param('token') token: string,
    @CurrentUser('userId') userId: number,
    @Body() dto: CreateBillDto,
  ) {
    return this.billService.create(token, userId, dto);
  }

  @Get('events/:token/bills')
  findAll(@Param('token') token: string) {
    return this.billService.findAllByEvent(token);
  }

  @Get('events/:token/bills/:billId/details')
  findDetails(
    @Param('token') token: string,
    @Param('billId', ParseIntPipe) billId: number,
  ) {
    return this.billService.findBillDetails(token, billId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/events/:token/bills/:billId')
  update(
    @Param('token') token: string,
    @Param('billId', ParseIntPipe) billId: number,
    @CurrentUser('userId') userId: number,
    @Body() dto: UpdateBillDto,
  ) {
    return this.billService.update(token, billId, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/events/:token/bills/:billId')
  remove(
    @Param('token') token: string,
    @Param('billId', ParseIntPipe) billId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.billService.delete(token, billId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/events/:token/bills/:billId/details')
  updateDetails(
    @Param('token') token: string,
    @Param('billId', ParseIntPipe) billId: number,
    @CurrentUser('userId') userId: number,
    @Body() dto: UpdateBillDetailsDto,
  ) {
    return this.billService.updateDetails(token, billId, userId, dto);
  }
}
