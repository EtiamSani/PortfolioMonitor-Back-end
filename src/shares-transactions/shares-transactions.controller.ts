import { Controller, Get } from '@nestjs/common';
import { SharesTransactionsService } from './shares-transactions.service';

@Controller('shares-transactions')
export class SharesTransactionsController {
    constructor(private boughtSharesService: SharesTransactionsService){}

    @Get('/buy')
    boughtShares(){
        return this.boughtSharesService.getAllBoughtShares()
    }

    @Get('/sell')
    soldShares(){
        return this.boughtSharesService.getAllSoldShares()
    }
}
