import { IsNumber, IsOptional, IsString, isNotEmpty} from 'class-validator';

export class PortfolioDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    moneyInput?: number;

    @IsNumber()
    @IsOptional()
    liquidity?: number;

    @IsNumber()
    @IsOptional()
    gainOrLost?: number;

    @IsNumber()
    @IsOptional()
    portfolioValue?: number;

    @IsString()
    @IsOptional()
    portfolioOwnerId?: string;
}