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
    per: number;
    @IsNumber()
    low52?: number | null;
    @IsNumber()
    high52?: number | null;
    @IsNumber()
    volume?: number | null;
    @IsNumber()
    numberOfStocks: number;
    @IsNumber()
    pru: number;
    @IsString()
    stockCategory: string;
    @IsString()
    gics?: string | null;
    @IsString()
    country: string;
    @IsNumber()
    annualDividend: number;
}