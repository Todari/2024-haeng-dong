import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from '../event/event.service';

const mockEvent = { id: 1, userId: 10, token: 'event-token', deletedAt: null };

const mockPrisma = {
  bill: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  billDetail: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

const mockEventService = {
  getEventByToken: jest.fn(),
};

describe('BillService', () => {
  let service: BillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EventService, useValue: mockEventService },
      ],
    }).compile();

    service = module.get<BillService>(BillService);
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation((cb: (tx: typeof mockPrisma) => unknown) => cb(mockPrisma));
  });

  describe('create', () => {
    it('상세 금액 합계가 총액과 일치하면 청구를 생성한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.bill.create.mockResolvedValue({
        id: 1,
        title: '저녁',
        price: BigInt(10000),
        billDetails: [
          { id: 1, memberId: 1, price: BigInt(5000), isFixed: false },
          { id: 2, memberId: 2, price: BigInt(5000), isFixed: false },
        ],
      });

      await service.create('event-token', 10, {
        title: '저녁',
        price: 10000,
        billDetails: [
          { memberId: 1, price: 5000, isFixed: false },
          { memberId: 2, price: 5000, isFixed: false },
        ],
      });

      expect(mockPrisma.bill.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            eventId: 1,
            title: '저녁',
            price: BigInt(10000),
          }),
        }),
      );
    });

    it('상세 금액 합계가 총액과 다르면 BadRequestException을 던진다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);

      await expect(
        service.create('event-token', 10, {
          title: '저녁',
          price: 10000,
          billDetails: [
            { memberId: 1, price: 3000, isFixed: false },
            { memberId: 2, price: 3000, isFixed: false },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('이벤트 소유자가 아니면 ForbiddenException을 던진다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);

      await expect(
        service.create('event-token', 999, {
          title: '저녁',
          price: 10000,
          billDetails: [{ memberId: 1, price: 10000, isFixed: false }],
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllByEvent', () => {
    it('이벤트의 모든 청구를 조회한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.bill.findMany.mockResolvedValue([
        {
          id: 1,
          title: '저녁',
          price: BigInt(10000),
          billDetails: [
            {
              isFixed: false,
              member: { id: 1, name: 'Alice' },
              price: BigInt(10000),
            },
          ],
        },
      ]);

      const result = await service.findAllByEvent('event-token');

      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(10000);
      expect(result[0].members).toEqual([{ id: 1, name: 'Alice' }]);
    });
  });

  describe('findBillDetails', () => {
    it('청구의 상세 멤버별 금액을 반환한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.bill.findUnique.mockResolvedValue({ id: 1, eventId: 1 });
      mockPrisma.billDetail.findMany.mockResolvedValue([
        {
          id: 10,
          memberId: 1,
          price: BigInt(5000),
          isFixed: false,
          member: { name: 'Alice' },
        },
      ]);

      const result = await service.findBillDetails('event-token', 1);

      expect(result.members).toEqual([
        { id: 10, memberId: 1, memberName: 'Alice', price: 5000, isFixed: false },
      ]);
    });

    it('청구가 없으면 NotFoundException을 던진다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.bill.findUnique.mockResolvedValue(null);

      await expect(
        service.findBillDetails('event-token', 999),
      ).rejects.toThrow(NotFoundException);
    });

    it('청구가 다른 이벤트에 속하면 NotFoundException을 던진다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.bill.findUnique.mockResolvedValue({ id: 1, eventId: 999 });

      await expect(
        service.findBillDetails('event-token', 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('소유자이면 청구를 수정한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.bill.findUnique.mockResolvedValue({ id: 1, eventId: 1 });

      await service.update('event-token', 1, 10, {
        title: '수정된 제목',
        price: 20000,
      });

      expect(mockPrisma.bill.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: '수정된 제목', price: BigInt(20000) },
      });
    });

    it('소유자가 아니면 ForbiddenException을 던진다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);

      await expect(
        service.update('event-token', 1, 999, { title: '제목', price: 10000 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('소유자이면 청구를 삭제한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.bill.findUnique.mockResolvedValue({ id: 1, eventId: 1 });

      await service.delete('event-token', 1, 10);

      expect(mockPrisma.bill.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('updateDetails', () => {
    it('트랜잭션으로 기존 상세를 삭제하고 새로 생성한다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.bill.findUnique.mockResolvedValue({
        id: 1,
        eventId: 1,
        price: BigInt(10000),
      });

      await service.updateDetails('event-token', 1, 10, {
        billDetails: [
          { memberId: 1, price: 4000, isFixed: true },
          { memberId: 2, price: 6000, isFixed: false },
        ],
      });

      expect(mockPrisma.billDetail.deleteMany).toHaveBeenCalledWith({
        where: { billId: 1 },
      });
      expect(mockPrisma.billDetail.createMany).toHaveBeenCalled();
    });

    it('상세 금액 합계가 청구 금액과 다르면 BadRequestException을 던진다', async () => {
      mockEventService.getEventByToken.mockResolvedValue(mockEvent);
      mockPrisma.bill.findUnique.mockResolvedValue({
        id: 1,
        eventId: 1,
        price: BigInt(10000),
      });

      await expect(
        service.updateDetails('event-token', 1, 10, {
          billDetails: [
            { memberId: 1, price: 3000, isFixed: false },
            { memberId: 2, price: 3000, isFixed: false },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
