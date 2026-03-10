import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockTx = {
  user: { create: jest.fn() },
  event: { create: jest.fn() },
  eventMember: { create: jest.fn() },
};

const mockPrisma = {
  user: { findUnique: jest.fn() },
  event: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  eventMember: { create: jest.fn() },
  $transaction: jest.fn((cb) => cb(mockTx)),
};

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation((cb) => cb(mockTx));
  });

  describe('createGuestEvent', () => {
    it('User, Event, EventMember를 트랜잭션으로 생성하고 토큰을 반환한다', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      mockTx.user.create.mockResolvedValue({ id: 1 });
      mockTx.event.create.mockResolvedValue({ id: 1, token: 'generated-token' });
      mockTx.eventMember.create.mockResolvedValue({ id: 1 });

      const result = await service.createGuestEvent({
        eventName: '모임',
        nickname: '홍길동',
        password: '1234',
      });

      expect(result.eventId).toBeDefined();
      expect(typeof result.eventId).toBe('string');
      expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
      expect(mockTx.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ nickname: '홍길동' }),
        }),
      );
      expect(mockTx.event.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: '모임',
            createdByGuest: true,
          }),
        }),
      );
      expect(mockTx.eventMember.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ name: '홍길동' }),
        }),
      );
    });
  });

  describe('createEvent', () => {
    it('로그인 사용자의 이벤트를 생성하고 은행 정보를 복사한다', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        nickname: '유저',
        bankName: '카카오뱅크',
        accountNumber: '1234567890',
      });
      mockPrisma.event.create.mockResolvedValue({ id: 1, token: 'abc123' });
      mockPrisma.eventMember.create.mockResolvedValue({ id: 1 });

      const result = await service.createEvent({ eventName: '회식' }, 1);

      expect(result.eventId).toBe('abc123');
      expect(mockPrisma.event.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            bankName: '카카오뱅크',
            accountNumber: '1234567890',
            createdByGuest: false,
          }),
        }),
      );
    });

    it('사용자가 없으면 NotFoundException을 던진다', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.createEvent({ eventName: '회식' }, 999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByToken', () => {
    it('이벤트 정보를 반환한다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 1,
        name: '모임',
        bankName: '신한',
        accountNumber: '111',
        createdByGuest: true,
        user: { bankName: null, accountNumber: null },
      });

      const result = await service.findByToken('token-abc');

      expect(result).toEqual({
        eventName: '모임',
        bankName: '신한',
        accountNumber: '111',
        createdByGuest: true,
      });
    });

    it('이벤트가 없으면 NotFoundException을 던진다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      await expect(service.findByToken('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findMyEvents', () => {
    it('사용자의 이벤트 목록을 반환한다', async () => {
      mockPrisma.event.findMany.mockResolvedValue([
        {
          token: 'token-1',
          name: '모임1',
          createdAt: new Date('2024-01-01'),
          members: [{ isDeposited: true }, { isDeposited: true }],
        },
        {
          token: 'token-2',
          name: '모임2',
          createdAt: new Date('2024-02-01'),
          members: [{ isDeposited: true }, { isDeposited: false }],
        },
      ]);

      const result = await service.findMyEvents(1);

      expect(result.events).toHaveLength(2);
      expect(result.events[0].isFinished).toBe(true);
      expect(result.events[1].isFinished).toBe(false);
    });
  });

  describe('update', () => {
    it('이벤트 소유자이면 이벤트를 수정한다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 1,
        userId: 10,
        deletedAt: null,
      });

      await service.update('token', 10, { eventName: '새이름' });

      expect(mockPrisma.event.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { name: '새이름' },
        }),
      );
    });

    it('소유자가 아니면 ForbiddenException을 던진다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 1,
        userId: 10,
        deletedAt: null,
      });

      await expect(
        service.update('token', 999, { eventName: '새이름' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteEvents', () => {
    it('소유자이면 soft delete를 수행한다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 1,
        userId: 10,
        deletedAt: null,
      });

      await service.deleteEvents(['token-1'], 10);

      expect(mockPrisma.event.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { deletedAt: expect.any(Date) },
        }),
      );
    });

    it('소유자가 아니면 ForbiddenException을 던진다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 1,
        userId: 10,
        deletedAt: null,
      });

      await expect(
        service.deleteEvents(['token-1'], 999),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
