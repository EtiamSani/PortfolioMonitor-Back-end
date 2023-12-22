import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioDto } from './dto/portfolio.dto';
import { JwtGuard } from 'src/auth-portfolio-owner/guard';

// @UseGuards(JwtGuard)
@Controller('portfolio')
export class PortfolioController {
    constructor(private portfolioService : PortfolioService){}
    
    @Post()
    creatPortfolio(@Body() dto:PortfolioDto){
        return this.portfolioService.creatPortfolio(dto)
    }

    @Get(':portfolioOwnerId')
    getPortfolioWithCompanies(@Param('portfolioOwnerId') portfolioOwnerId: string){
        return this.portfolioService.getPortfolioWithCompanies(portfolioOwnerId)
    }

    @Get('get-portfolio/:portfolioId')
    getPortfolioById(@Param('portfolioId') portfolioId: string){
        return this.portfolioService.getPortfolioById(portfolioId)
    }

    @Patch('update/:portfolioId')
    modificationOfPortfolio(@Param('portfolioId') portfolioId: string, @Body() dto:PortfolioDto ){
        return this.portfolioService.modificationOfPortfolio(portfolioId, dto)
    }
    // calculatePortfolioTotalGainOrLost
    @Get('get-portfolio/market-value/:portfolioId')
        calculatePortfolioMarketValue(@Param('portfolioId') portfolioId: string){
            return this.portfolioService.calculatePortfolioMarketValue(portfolioId)
        }
    
    @Get('get-portfolio/total-gain-or-lost/:portfolioId')
    calculatePortfolioTotalGainOrLost(@Param('portfolioId') portfolioId: string){
            return this.portfolioService.calculatePortfolioTotalGainOrLost(portfolioId)
        }
}
