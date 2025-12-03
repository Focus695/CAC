import { Module } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { GamificationController } from './gamification.controller';

@Module({
  providers: [GamificationService],
  controllers: [GamificationController],
})
export class GamificationModule {}
