import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { OwnerAnalysisService } from './owner-analysis.service';

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
}
