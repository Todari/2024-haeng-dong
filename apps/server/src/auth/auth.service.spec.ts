import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockPrisma = {
  event: {
    findUnique: jest.fn(),
  },
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('authenticateAdmin', () => {
    it('이벤트 소유자이면 admin JWT를 발급한다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 1,
        token: 'event-token',
        userId: 10,
        deletedAt: null,
      });

      const result = await service.authenticateAdmin('event-token', 10);

      expect(result).toEqual({ token: 'mock-jwt-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 10,
        eventToken: 'event-token',
        role: 'admin',
      });
    });

    it('이벤트가 없으면 NotFoundException을 던진다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      await expect(
        service.authenticateAdmin('invalid-token', 10),
      ).rejects.toThrow(NotFoundException);
    });

    it('소유자가 아니면 UnauthorizedException을 던진다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 1,
        token: 'event-token',
        userId: 10,
        deletedAt: null,
      });

      await expect(
        service.authenticateAdmin('event-token', 999),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('loginWithPassword', () => {
    const event = { id: 1, token: 'event-token', userId: 10, deletedAt: null };
    const user = { id: 10, password: 'hashed-password' };

    it('비밀번호가 일치하면 JWT를 발급한다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(event);
      mockPrisma.user.findFirst.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginWithPassword(
        'event-token',
        'password123',
      );

      expect(result).toEqual({ token: 'mock-jwt-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 10,
        eventToken: 'event-token',
      });
    });

    it('이벤트가 없으면 NotFoundException을 던진다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      await expect(
        service.loginWithPassword('invalid-token', 'password123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('사용자가 없으면 UnauthorizedException을 던진다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(event);
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.loginWithPassword('event-token', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('비밀번호가 일치하지 않으면 UnauthorizedException을 던진다', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(event);
      mockPrisma.user.findFirst.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.loginWithPassword('event-token', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyToken', () => {
    it('유효한 토큰을 검증하고 페이로드를 반환한다', () => {
      const payload = { sub: 10, eventToken: 'event-token' };
      mockJwtService.verify.mockReturnValue(payload);

      const result = service.verifyToken('valid-token');

      expect(result).toEqual(payload);
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token');
    });
  });
});
