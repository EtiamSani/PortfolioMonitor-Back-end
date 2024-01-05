import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { OwnerAnalysisService } from './owner-analysis.service';
import { Response } from 'express';

@Controller('owner-analysis')
export class OwnerAnalysisController {
    constructor(private ownerAnalysisService : OwnerAnalysisService) {}
    
@Post('upload/:ownerId')
@UseInterceptors(FileInterceptor('pdfFile'))
uploadFile(@UploadedFile() file: Express.Multer.File, @Param('ownerId') ownerId:string) {
  return this.ownerAnalysisService.uploadFile(file,ownerId)
}

@Get('all-pdfs')
    async getAllPDFs() {
        return this.ownerAnalysisService.getAllAnalysisPDFs();
    }

@Get('download/:pdfId')
    async downloadPDF(@Param('pdfId') pdfId: string, @Res() res: Response) {
        const analysis = await this.ownerAnalysisService.downloadPDF(pdfId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="downloaded.pdf"');
        res.send(Buffer.from(analysis.file));
    }  
}
