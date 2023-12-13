import { Module } from '@nestjs/common';
import { AuthPortfolioOwnerModule } from './auth-portfolio-owner/auth-portfolio-owner.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true}),
    AuthPortfolioOwnerModule,
    PrismaModule
  ],
})
export class AppModule {}
