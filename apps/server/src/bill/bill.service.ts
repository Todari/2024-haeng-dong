import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from '../event/event.service';
import { CreateBillDto, UpdateBillDto, UpdateBillDetailsDto } from './bill.dto';

@Injectable()
export class BillService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {}

  async create(eventToken: string, userId: number, dto: CreateBillDto) {
    const event = await this.eventService.getEventByToken(eventToken);
    this.verifyOwner(event, userId);
    this.validateDetailPriceSum(dto.price, dto.billDetails);

    return this.prisma.bill.create({
      data: {
        eventId: event.id,
        title: dto.title,
        price: BigInt(dto.price),
        billDetails: {
          create: dto.billDetails.map((d) => ({
            memberId: d.memberId,
            price: BigInt(d.price),
            isFixed: d.isFixed,
          })),
        },
      },
      include: { billDetails: true },
    });
  }

  async findAllByEvent(eventToken: string) {
    const event = await this.eventService.getEventByToken(eventToken);

    const bills = await this.prisma.bill.findMany({
      where: { eventId: event.id },
      include: {
        billDetails: {
          include: { member: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return bills.map((bill) => ({
      id: bill.id,
      title: bill.title,
      price: Number(bill.price),
      isFixed: bill.billDetails.some((d) => d.isFixed),
      members: [
        ...new Map(
          bill.billDetails.map((d) => [
            d.member.id,
            { id: d.member.id, name: d.member.name },
          ]),
        ).values(),
      ],
      details: bill.billDetails.map((d) => ({
        memberId: d.member.id,
        price: Number(d.price),
      })),
    }));
  }

  async findBillDetails(eventToken: string, billId: number) {
    const event = await this.eventService.getEventByToken(eventToken);
    const bill = await this.getBill(billId);
    this.verifyEventMatch(bill.eventId, event.id);

    const details = await this.prisma.billDetail.findMany({
      where: { billId },
      include: { member: true },
    });

    return {
      members: details.map((d) => ({
        id: d.id,
        memberId: d.memberId,
        memberName: d.member.name,
        price: Number(d.price),
        isFixed: d.isFixed,
      })),
    };
  }

  async update(
    eventToken: string,
    billId: number,
    userId: number,
    dto: UpdateBillDto,
  ) {
    const event = await this.eventService.getEventByToken(eventToken);
    this.verifyOwner(event, userId);
    const bill = await this.getBill(billId);
    this.verifyEventMatch(bill.eventId, event.id);

    await this.prisma.bill.update({
      where: { id: billId },
      data: { title: dto.title, price: BigInt(dto.price) },
    });
  }

  async delete(eventToken: string, billId: number, userId: number) {
    const event = await this.eventService.getEventByToken(eventToken);
    this.verifyOwner(event, userId);
    const bill = await this.getBill(billId);
    this.verifyEventMatch(bill.eventId, event.id);

    await this.prisma.bill.delete({ where: { id: billId } });
  }

  async updateDetails(
    eventToken: string,
    billId: number,
    userId: number,
    dto: UpdateBillDetailsDto,
  ) {
    const event = await this.eventService.getEventByToken(eventToken);
    this.verifyOwner(event, userId);
    const bill = await this.getBill(billId);
    this.verifyEventMatch(bill.eventId, event.id);
    this.validateDetailPriceSum(Number(bill.price), dto.billDetails);

    await this.prisma.$transaction(async (tx) => {
      await tx.billDetail.deleteMany({ where: { billId } });
      await tx.billDetail.createMany({
        data: dto.billDetails.map((d) => ({
          billId,
          memberId: d.memberId,
          price: BigInt(d.price),
          isFixed: d.isFixed,
        })),
      });
    });
  }

  private async getBill(billId: number) {
    const bill = await this.prisma.bill.findUnique({ where: { id: billId } });
    if (!bill) throw new NotFoundException('청구를 찾을 수 없습니다.');
    return bill;
  }

  private verifyOwner(event: { userId: number }, userId: number) {
    if (event.userId !== userId) {
      throw new ForbiddenException('이벤트 관리자가 아닙니다.');
    }
  }

  private verifyEventMatch(billEventId: number, eventId: number) {
    if (billEventId !== eventId) {
      throw new NotFoundException('청구를 찾을 수 없습니다.');
    }
  }

  private validateDetailPriceSum(
    totalPrice: number,
    details: { price: number }[],
  ) {
    const sum = details.reduce((acc, d) => acc + d.price, 0);
    if (sum !== totalPrice) {
      throw new BadRequestException(
        '청구 상세 금액의 합이 총 금액과 일치하지 않습니다.',
      );
    }
  }
}
