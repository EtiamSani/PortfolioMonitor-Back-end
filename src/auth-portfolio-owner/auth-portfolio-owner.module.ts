import { Module } from '@nestjs/common';
import { AuthPortfolioOwnerService } from './auth-portfolio-owner.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthPortfolioOwnerController } from './auth-portfolio-owner.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({

  })],
  controllers: [AuthPortfolioOwnerController],
  providers: [AuthPortfolioOwnerService]
})
export class AuthPortfolioOwnerModule {}
