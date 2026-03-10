import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { MemberService } from './member.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from '../event/event.service';

const mockEvent = { id: 1, userId: 10, token: 'event-token', deletedAt: null };

const mockTx = {
  billDetail: { deleteMany: jest.fn() },
  eventMember: { delete: jest.fn() },
};

const mockPrisma = {
  eventMember: {
    createManyAndReturn: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
  billDetail: { deleteMany: jest.fn() },
  $transaction: jest.fn(),
};

const mockEventService = {
  getEventByToken: jest.fn(),
};

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EventService, useValue: mockEventService },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation((cbOrArr) => {
      if (typeof cbOrArr === 'function') return cbOrArr(mockTx);
      return Promise.all(cbOrArr);
    });
  });

  describe('addMembers', () => {
    it('멤버를 추가하고 id/name 목록을 반환한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.eventMember.createManyAndReturn.mockResolvedValue([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);

      const result = await service.addMembers('event-token', 10, {
        names: ['Alice', 'Bob'],
      });

      expect(result.members).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
    });

    it('소유자가 아니면 ForbiddenException을 던진다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);

      await expect(
        service.addMembers('event-token', 999, { names: ['Alice'] }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllByEvent', () => {
    it('이벤트의 모든 멤버를 isDeposited 포함하여 반환한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.eventMember.findMany.mockResolvedValue([
        { id: 1, name: 'Alice', isDeposited: true },
        { id: 2, name: 'Bob', isDeposited: false },
      ]);

      const result = await service.findAllByEvent('event-token');

      expect(result.members).toEqual([
        { id: 1, name: 'Alice', isDeposited: true },
        { id: 2, name: 'Bob', isDeposited: false },
      ]);
    });
  });

  describe('findCurrentMembers', () => {
    it('id와 name만 반환한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.eventMember.findMany.mockResolvedValue([
        { id: 1, name: 'Alice', isDeposited: true },
      ]);

      const result = await service.findCurrentMembers('event-token');

      expect(result.members).toEqual([{ id: 1, name: 'Alice' }]);
    });
  });

  describe('updateMembers', () => {
    it('소유자이면 멤버 이름과 입금 상태를 일괄 수정한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);

      await service.updateMembers('event-token', 10, {
        members: [
          { id: 1, name: 'Alice 수정', isDeposited: true },
        ],
      });

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('소유자가 아니면 ForbiddenException을 던진다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);

      await expect(
        service.updateMembers('event-token', 999, {
          members: [{ id: 1, name: 'Test', isDeposited: false }],
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteMember', () => {
    it('멤버의 BillDetail을 먼저 삭제한 후 멤버를 삭제한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.eventMember.findFirst.mockResolvedValue({
        id: 1,
        eventId: 1,
        name: 'Alice',
      });

      await service.deleteMember('event-token', 1, 10);

      expect(mockTx.billDetail.deleteMany).toHaveBeenCalledWith({
        where: { memberId: 1 },
      });
      expect(mockTx.eventMember.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('멤버가 없으면 NotFoundException을 던진다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.eventMember.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteMember('event-token', 999, 10),
      ).rejects.toThrow(NotFoundException);
    });

    it('소유자가 아니면 ForbiddenException을 던진다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);

      await expect(
        service.deleteMember('event-token', 1, 999),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
