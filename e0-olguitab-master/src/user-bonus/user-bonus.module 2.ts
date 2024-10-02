import { Module } from '@nestjs/common';
import { UserBonusService } from './user-bonus.service';
import { UserBonusController } from './user-bonus.controller';

@Module({
  controllers: [UserBonusController],
  providers: [UserBonusService],
})
export class UserBonusModule {}
