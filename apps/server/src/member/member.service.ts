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
      data: dto.names.map((name) => ({
        eventId: event.id,
        name,
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
      await tx.billDetail.deleteMany({ where: { memberId } });
      await tx.eventMember.delete({ where: { id: memberId } });
    });
  }

  private verifyOwner(event: { userId: number }, userId: number) {
    if (event.userId !== userId) {
      throw new ForbiddenException('이벤트 관리자가 아닙니다.');
    }
  }
}
