import { IsNumber, IsString } from "class-validator";

export class AnalysisDto {
    @IsNumber()
    fairValue?: number | null;
    @IsString()
    stockCategory?: string | null;
    @IsString()
    peaOrCto: string | null;
    @IsNumber()
    entryPoint: number | null;
}