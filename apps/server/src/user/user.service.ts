import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    return {
      nickname: user.nickname,
      bankName: user.bankName ?? '',
      accountNumber: user.accountNumber ?? '',
      isGuest: !user.memberNumber,
      profileImage: user.picture,
    };
  }

  async update(userId: number, dto: UpdateUserDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.nickname !== undefined && { nickname: dto.nickname }),
        ...(dto.bankName !== undefined && { bankName: dto.bankName }),
        ...(dto.accountNumber !== undefined && {
          accountNumber: dto.accountNumber,
        }),
      },
    });
  }

  async deleteUser(userId: number) {
    await this.prisma.$transaction(async (tx) => {
      await tx.event.updateMany({
        where: { userId },
        data: { deletedAt: new Date() },
      });
      await tx.user.delete({ where: { id: userId } });
    });
  }
}
