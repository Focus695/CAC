import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    let profile = await this.prisma.gamificationProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await this.prisma.gamificationProfile.create({
        data: {
          userId,
          points: 0,
          level: 1,
          experience: 0,
        },
      });
    }

    return profile;
  }

  async addPoints(userId: string, points: number) {
    const profile = await this.getUserProfile(userId);

    return this.prisma.gamificationProfile.update({
      where: { userId },
      data: {
        points: profile.points + points,
        experience: profile.experience + points,
      },
    });
  }
}
