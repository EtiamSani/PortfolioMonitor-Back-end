import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CompanyDTO } from './dto';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
    constructor(private companyService: CompanyService){}

    @Post(':ownerPortfolioId')
    createCompanyAndConnectToPortfolio(@Param('ownerPortfolioId') ownerPortfolioId: string, @Body() dto:CompanyDTO){
        return this.companyService.createCompanyAndConnectToPortfolio(dto, ownerPortfolioId)
    }
    
    @Delete('delete-company/:companyId')
    deleteCompanyAndDisconnectFromPortfolio(@Param('companyId') companyId: string){
        return this.companyService.deleteCompanyAndDisconnectFromPortfolio(companyId)
    }

    @Patch('update-company/:companyId')
    updateCompany(@Param('companyId') companyId: string, @Body() dto:CompanyDTO){
        return this.companyService.updateCompany(dto,companyId)
    }

}
