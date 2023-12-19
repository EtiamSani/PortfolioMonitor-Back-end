import { Body, Controller, Param, Post } from '@nestjs/common';
import { SellCompanyService } from './sell-company.service';
import { SellCompanyDto } from './dto';

@Controller('sell-company')
export class SellCompanyController {
    constructor(private sellCompanyService:SellCompanyService){}
    @Post(':companyId')
    buyNewShareOfACompany(@Param('companyId') companyId: string, @Body() dto:SellCompanyDto){
        console.log(dto)
        return this.sellCompanyService.sellShareOfACompany(dto, companyId)
    }
}
