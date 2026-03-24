import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from '../event/event.service';
import { CreateMemberDto, UpdateMembersDto } from './member.dto';

@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {}

  async addMembers(eventToken: string, userId: number, dto: CreateMemberDto) {
    const event = await this.eventService.getEventByToken(eventToken);
    this.verifyOwner(event, userId);

    const members = await this.prisma.eventMember.createManyAndReturn({
      data: dto.members.map((m) => ({
        eventId: event.id,
        name: m.name,
      })),
    });

    return { members: members.map((m) => ({ id: m.id, name: m.name })) };
  }

  async findAllByEvent(eventToken: string) {
    const event = await this.eventService.getEventByToken(eventToken);

    const members = await this.prisma.eventMember.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: 'asc' },
    });

    return {
      members: members.map((m) => ({
        id: m.id,
        name: m.name,
        isDeposited: m.isDeposited,
      })),
    };
  }

  async findCurrentMembers(eventToken: string) {
    const event = await this.eventService.getEventByToken(eventToken);

    const members = await this.prisma.eventMember.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: 'asc' },
    });

    return {
      members: members.map((m) => ({ id: m.id, name: m.name })),
    };
  }

  async updateMembers(
    eventToken: string,
    userId: number,
    dto: UpdateMembersDto,
  ) {
    const event = await this.eventService.getEventByToken(eventToken);
    this.verifyOwner(event, userId);

    await this.prisma.$transaction(
      dto.members.map((m) =>
        this.prisma.eventMember.update({
          where: { id: m.id, eventId: event.id },
          data: { name: m.name, isDeposited: m.isDeposited },
        }),
      ),
    );
  }

  async deleteMember(
    eventToken: string,
    memberId: number,
    userId: number,
  ) {
    const event = await this.eventService.getEventByToken(eventToken);
    this.verifyOwner(event, userId);

    const member = await this.prisma.eventMember.findFirst({
      where: { id: memberId, eventId: event.id },
    });
    if (!member) throw new NotFoundException('멤버를 찾을 수 없습니다.');

    await this.prisma.$transaction(async (tx) => {
      // 해당 멤버가 포함된 청구서 목록 조회
      const affectedBills = await tx.billDetail.findMany({
        where: { memberId },
        select: { billId: true },
      });
      const billIds = [...new Set(affectedBills.map((d) => d.billId))];

      // 멤버의 BillDetail 삭제
      await tx.billDetail.deleteMany({ where: { memberId } });

      // 남은 BillDetail 금액을 재분배하여 Bill.price와 일치시킴
      for (const billId of billIds) {
        const bill = await tx.bill.findUnique({ where: { id: billId } });
        if (!bill) continue;

        const remainingDetails = await tx.billDetail.findMany({
          where: { billId },
        });

        if (remainingDetails.length === 0) {
          await tx.bill.delete({ where: { id: billId } });
          continue;
        }

        const totalPrice = Number(bill.price);
        const perMember = Math.floor(totalPrice / remainingDetails.length);
        const remainder = totalPrice - perMember * remainingDetails.length;

        for (let i = 0; i < remainingDetails.length; i++) {
          const newPrice = i === remainingDetails.length - 1
            ? perMember + remainder
            : perMember;
          await tx.billDetail.update({
            where: { id: remainingDetails[i].id },
            data: { price: BigInt(newPrice), isFixed: false },
          });
        }
      }

      await tx.eventMember.delete({ where: { id: memberId } });
    });
  }

  private verifyOwner(event: { userId: number }, userId: number) {
    if (event.userId !== userId) {
      throw new ForbiddenException('이벤트 관리자가 아닙니다.');
    }
  }
}
