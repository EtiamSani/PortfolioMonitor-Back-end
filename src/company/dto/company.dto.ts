import { IsNumber, IsString } from "class-validator";

export class CompanyDTO {
    @IsString()
    logo?: string | null;
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
    @IsNumber()
    pruValue: number;
    @IsNumber()
    marketValue: number;
    @IsNumber()
    gainOrLoss: number;
    @IsNumber()
    pvMvPercentage: number;
    @IsString()
    stockCategory: string;
    @IsString()
    gics?: string | null;
    @IsString()
    country: string;
    @IsNumber()
    annualDividends?: number | null;
    @IsNumber()
    dividendsReceived?: number | null;
 
}