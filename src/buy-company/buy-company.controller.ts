import { Body, Controller, Param, Post } from '@nestjs/common';
import { BuyCompanyService } from './buy-company.service';
import { BuyCompanyDto } from './dto/buy-company.dto';

@Controller('buy-company')
export class BuyCompanyController {
    constructor(private buyCompanyService:BuyCompanyService){}

    @Post(':companyId')
    buyNewShareOfACompany(@Param('companyId') companyId: string, @Body() dto:BuyCompanyDto){
        return this.buyCompanyService.buyNewShareOfACompany(dto, companyId)
    }

}
