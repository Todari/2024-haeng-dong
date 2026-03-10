import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, CreateGuestEventDto, UpdateEventDto } from './event.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  private generateToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  async createGuestEvent(dto: CreateGuestEventDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const token = this.generateToken();

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          nickname: dto.nickname,
          password: hashedPassword,
        },
      });

      const event = await tx.event.create({
        data: {
          name: dto.eventName,
          token,
          userId: user.id,
          createdByGuest: true,
        },
      });

      await tx.eventMember.create({
        data: {
          eventId: event.id,
          name: dto.nickname,
        },
      });

      return { eventId: event.token };
    });
  }

  async createEvent(dto: CreateEventDto, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const token = this.generateToken();

    const event = await this.prisma.event.create({
      data: {
        name: dto.eventName,
        token,
        userId,
        createdByGuest: false,
        bankName: user.bankName,
        accountNumber: user.accountNumber,
      },
    });

    await this.prisma.eventMember.create({
      data: {
        eventId: event.id,
        name: user.nickname,
      },
    });

    return { eventId: event.token };
  }

  async findByToken(token: string) {
    const event = await this.prisma.event.findUnique({
      where: { token, deletedAt: null },
      include: { user: true },
    });
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

    return {
      eventName: event.name,
      bankName: event.bankName ?? event.user.bankName ?? '',
      accountNumber: event.accountNumber ?? event.user.accountNumber ?? '',
      createdByGuest: event.createdByGuest,
    };
  }

  async findMyEvents(userId: number) {
    const events = await this.prisma.event.findMany({
      where: { userId, deletedAt: null },
      include: {
        members: { select: { isDeposited: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      events: events.map((event) => ({
        eventId: event.token,
        eventName: event.name,
        isFinished: event.members.every((m) => m.isDeposited),
        createdAt: event.createdAt.toISOString(),
      })),
    };
  }

  async update(token: string, userId: number, dto: UpdateEventDto) {
    const event = await this.getEventByToken(token);
    this.verifyOwner(event, userId);

    await this.prisma.event.update({
      where: { id: event.id },
      data: {
        ...(dto.eventName !== undefined && { name: dto.eventName }),
        ...(dto.bankName !== undefined && { bankName: dto.bankName }),
        ...(dto.accountNumber !== undefined && {
          accountNumber: dto.accountNumber,
        }),
      },
    });
  }

  async deleteEvents(tokens: string[], userId: number) {
    for (const token of tokens) {
      const event = await this.getEventByToken(token);
      this.verifyOwner(event, userId);
      await this.prisma.event.update({
        where: { id: event.id },
        data: { deletedAt: new Date() },
      });
    }
  }

  async getEventByToken(token: string) {
    const event = await this.prisma.event.findUnique({
      where: { token, deletedAt: null },
    });
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    return event;
  }

  private verifyOwner(
    event: { userId: number },
    userId: number,
  ) {
    if (event.userId !== userId) {
      throw new ForbiddenException('이벤트 관리자가 아닙니다.');
    }
  }
}
