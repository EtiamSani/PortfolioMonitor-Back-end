import { Module } from '@nestjs/common';
import { AuthPortfolioOwnerService } from './auth-portfolio-owner.service';

@Module({
  providers: [AuthPortfolioOwnerService]
})
export class AuthPortfolioOwnerModule {}
