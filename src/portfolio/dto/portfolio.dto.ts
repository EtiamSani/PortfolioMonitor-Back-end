import {IsNotEmpty, IsString} from 'class-validator';

export class PortfolioDto {
    @IsString()
    name: string;

    @IsString()
    portfolioOwnerId: string;

}