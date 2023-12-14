import { Body, Controller, Post } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioDto } from './dto';

@Controller('portfolio')
export class PortfolioController {
    constructor(private portfolioService : PortfolioService){}

    @Post()
    creatPortfolio(@Body() dto:PortfolioDto){
        return this.portfolioService.creatPortfolio(dto)
    }
}
