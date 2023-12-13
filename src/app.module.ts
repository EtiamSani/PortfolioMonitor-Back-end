import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthPortfolioOwnerController } from './auth-portfolio-owner/auth-portfolio-owner.controller';
import { AuthPortfolioOwnerModule } from './auth-portfolio-owner/auth-portfolio-owner.module';

@Module({
  imports: [AuthPortfolioOwnerModule],
  controllers: [AppController, AuthPortfolioOwnerController],
  providers: [AppService],
})
export class AppModule {}
