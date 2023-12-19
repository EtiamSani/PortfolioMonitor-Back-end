import { Module } from '@nestjs/common';
import { AuthPortfolioOwnerModule } from './auth-portfolio-owner/auth-portfolio-owner.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CompanyModule } from './company/company.module';
import { BuyCompanyModule } from './buy-company/buy-company.module';
import { SellCompanyModule } from './sell-company/sell-company.module';



@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }),
    AuthPortfolioOwnerModule,
    PrismaModule,
    PortfolioModule,
    CompanyModule,
    BuyCompanyModule,
    SellCompanyModule,
  ],
})
export class AppModule {}
