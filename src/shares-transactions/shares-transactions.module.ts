import { Module } from '@nestjs/common';
import { SharesTransactionsController } from './shares-transactions.controller';
import { SharesTransactionsService } from './shares-transactions.service';

@Module({
  controllers: [SharesTransactionsController],
  providers: [SharesTransactionsService]
})
export class SharesTransactionsModule {}
