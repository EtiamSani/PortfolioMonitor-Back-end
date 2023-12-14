import { Module } from '@nestjs/common';
import { AuthPortfolioOwnerModule } from './auth-portfolio-owner/auth-portfolio-owner.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PortfolioModule } from './portfolio/portfolio.module';



@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }),
    AuthPortfolioOwnerModule,
    PrismaModule,
    PortfolioModule,
  ],
})
export class AppModule {}
