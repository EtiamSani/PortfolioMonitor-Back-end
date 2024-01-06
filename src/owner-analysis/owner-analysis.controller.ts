import { Body, Controller, Get, Param, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { OwnerAnalysisService } from './owner-analysis.service';
import { Response } from 'express';
import { AnalysisDto } from './dto/analysis.dto';

@Controller('owner-analysis')
export class OwnerAnalysisController {
    constructor(private ownerAnalysisService : OwnerAnalysisService) {}
    
@Post('upload/:ownerId')
@UseInterceptors(FileInterceptor('pdfFile'))
uploadFile(@UploadedFile() file: Express.Multer.File, @Param('ownerId') ownerId:string) {
  return this.ownerAnalysisService.uploadFile(file,ownerId)
}

@Get('all-pdfs-total')
    async getAllPDFsTotal() {
        return this.ownerAnalysisService.getAllAnalysisPDFsTotal();
    }

@Get('all-pdfs')
async getAllPDFs(
  @Query('page') page: number = 1,
  @Query('pageSize') pageSize: number = 10,
) {
  return this.ownerAnalysisService.getAllAnalysisPDFs(page, pageSize);
}

@Get('download/:pdfId')
    async downloadPDF(@Param('pdfId') pdfId: string, @Res() res: Response) {
        const analysis = await this.ownerAnalysisService.downloadPDF(pdfId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="downloaded.pdf"');
        res.send(Buffer.from(analysis.file));
    }  

@Patch('analysis-data/:pdfId')
    async updateAnalysisDate(@Param('pdfId') pdfId: string, @Body() dto:AnalysisDto){
       return this.ownerAnalysisService.updateAnalysisDate(pdfId, dto)
    }
}
