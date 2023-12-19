import { IsNumber, IsOptional, IsString } from "class-validator";

export class BuyCompanyDto {
    @IsString()
    nature: string;
    @IsString()
    objective: string;
    @IsString()
    message: string; 
    @IsNumber()
    numberOfStocks: number;
    @IsNumber()
    newPru: number;
    @IsString()
    companyId:string

    @IsOptional()
    @IsNumber()
    priceOfShare?:number | null
}