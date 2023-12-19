import { Module } from '@nestjs/common';
import { SellCompanyController } from './sell-company.controller';
import { SellCompanyService } from './sell-company.service';

@Module({
  controllers: [SellCompanyController],
  providers: [SellCompanyService]
})
export class SellCompanyModule {}
