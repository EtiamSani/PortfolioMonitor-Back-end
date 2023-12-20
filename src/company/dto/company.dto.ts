import { IsNumber, IsString } from "class-validator";

export class CompanyDTO {
    @IsString()
    name: string;
    @IsString()
    ticker: string;
    @IsString()
    currency: string;
    @IsString()
    type: string;
    @IsString()
    capitalisation: string;
    @IsNumber()
    numberOfStocks: number;
    @IsNumber()
    pru: number;
    @IsNumber()
    currentStockPrice: number;
    @IsString()
    stockCategory: string;
    @IsString()
    gics?: string | null;
    @IsString()
    country: string;
 
}