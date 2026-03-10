import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from '../event/event.service';
import * as crypto from 'crypto';

const MAX_IMAGE_COUNT = 10;

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {}

  async saveImages(
    eventToken: string,
    userId: number,
    imageNames: string[],
  ) {
    const event = await this.eventService.getEventByToken(eventToken);
    this.verifyOwner(event, userId);

    const existingCount = await this.prisma.eventImage.count({
      where: { eventId: event.id },
    });

    if (existingCount + imageNames.length > MAX_IMAGE_COUNT) {
      throw new BadRequestException(
        `이미지는 최대 ${MAX_IMAGE_COUNT}개까지 등록할 수 있습니다.`,
      );
    }

    const images = await Promise.all(
      imageNames.map((name) =>
        this.prisma.eventImage.create({
          data: {
            eventId: event.id,
            name: crypto.randomBytes(8).toString('hex') + name,
          },
        }),
      ),
    );

    return images.map((img) => ({ id: img.id, name: img.name }));
  }

  async findImages(eventToken: string) {
    const event = await this.eventService.getEventByToken(eventToken);

    const images = await this.prisma.eventImage.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: 'asc' },
    });

    return {
      images: images.map((img) => ({ id: img.id, url: img.name })),
    };
  }

  async deleteImage(
    eventToken: string,
    imageId: number,
    userId: number,
  ) {
    const event = await this.eventService.getEventByToken(eventToken);
    this.verifyOwner(event, userId);

    const image = await this.prisma.eventImage.findFirst({
      where: { id: imageId, eventId: event.id },
    });
    if (!image) throw new NotFoundException('이미지를 찾을 수 없습니다.');

    await this.prisma.eventImage.delete({ where: { id: imageId } });
    return { name: image.name };
  }

  private verifyOwner(event: { userId: number }, userId: number) {
    if (event.userId !== userId) {
      throw new ForbiddenException('이벤트 관리자가 아닙니다.');
    }
  }
}
