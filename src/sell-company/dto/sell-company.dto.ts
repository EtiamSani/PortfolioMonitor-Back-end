import { IsNumber, IsOptional, IsString } from "class-validator";

export class SellCompanyDto {
    @IsString()
    nature: string;
    @IsString()
    objective: string;
    @IsString()
    message: string; 
    @IsNumber()
    numberOfStocks: number;
   
    @IsString()
    companyId:string

    @IsOptional()
    @IsNumber()
    priceOfShare?:number | null
}