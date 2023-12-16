import { Body, Controller, Param, Post } from '@nestjs/common';
import { CompanyDTO } from './dto';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
    constructor(private companyService: CompanyService){}

    @Post(':ownerPortfolioId')
    createCompanyAndConnectToPortfolio(@Param('ownerPortfolioId') ownerPortfolioId: string, @Body() dto:CompanyDTO){
        return this.companyService.createCompanyAndConnectToPortfolio(dto, ownerPortfolioId)
    }
    
}
