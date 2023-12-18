import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class PortfolioDto {
    @IsString()
    name: string;

    @IsNumber()
    moneyInput?: number;
    @IsNumber()
    liquidity?: number;
    @IsNumber()
    gainOrlost?: number;
    @IsNumber()
    portfolioValue?: number;

    @IsString()
    portfolioOwnerId: string;

}