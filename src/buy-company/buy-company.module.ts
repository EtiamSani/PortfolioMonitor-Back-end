import { Module } from '@nestjs/common';
import { BuyCompanyService } from './buy-company.service';
import { BuyCompanyController } from './buy-company.controller';

@Module({
  providers: [BuyCompanyService],
  controllers: [BuyCompanyController]
})
export class BuyCompanyModule {}
