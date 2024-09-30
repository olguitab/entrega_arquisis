import { Controller } from '@nestjs/common';
import { UserBonusService } from './user-bonus.service';

@Controller('user-bonus')
export class UserBonusController {
  constructor(private readonly userBonusService: UserBonusService) {}
}
