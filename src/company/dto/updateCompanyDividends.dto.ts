import { IsNumber, IsString } from "class-validator";

export class updateCompanyDividendsDTO {
    @IsNumber()
    dividendsReceived?: number | null;
 
}