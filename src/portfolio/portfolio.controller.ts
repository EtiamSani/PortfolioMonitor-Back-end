import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioDto } from './dto/portfolio.dto';
import { JwtGuard } from 'src/auth-portfolio-owner/guard';

@UseGuards(JwtGuard)
@Controller('portfolio')
export class PortfolioController {
    constructor(private portfolioService : PortfolioService){}
    
    @Post()
    creatPortfolio(@Body() dto:PortfolioDto){
        return this.portfolioService.creatPortfolio(dto)
    }
}
