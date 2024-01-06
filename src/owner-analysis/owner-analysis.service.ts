import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalysisDto } from './dto/analysis.dto';

@Injectable()
export class OwnerAnalysisService {
    constructor(private prisma: PrismaService){}
    async uploadFile(file: Express.Multer.File, @Param('ownerId') ownerId:string) {
        try {
            const fileName = file.originalname;
            const sendPdfFile = await this.prisma.analysis.create({
                data : {
                    file : file.buffer,
                    portfolioOwner: { connect: { id: ownerId } },
                    fileName: fileName,
                }
            })
            return { success: true, sendPdfFile };
        } catch (error) {
            return { success: false, error: error.message };
        }
         
    }

    async getAllAnalysisPDFsTotal() {
        return this.prisma.analysis.findMany();
    }

    async getAllAnalysisPDFs(page: number = 1, pageSize: number = 20) {
        
        const offset = (page - 1) * pageSize;
      
        const analyses = await this.prisma.analysis.findMany({
          skip: offset,
          take: Number(pageSize),
        });
      
        return analyses;
      }
      

    async downloadPDF(pdfId: string) {
        const analysis = await this.prisma.analysis.findUnique({
            where: { id: pdfId },
        });

        if (!analysis) {
            throw new NotFoundException('PDF not found');
        }

        return analysis;
    }

    async updateAnalysisDate(pdfId: string, dto:AnalysisDto) {
        const updateAnalysisData = await this.prisma.analysis.updateMany({
            where: { 
                id: pdfId
             },
             data: {
                fairValue: dto.fairValue, 
                stockCategory: dto.stockCategory, 
                peaOrCto: dto.peaOrCto, 
                entryPoint: dto.entryPoint, 
             } 
        });
        return updateAnalysisData;
    }
}
