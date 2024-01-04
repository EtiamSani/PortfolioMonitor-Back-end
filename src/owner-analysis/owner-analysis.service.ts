import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

    async getAllAnalysisPDFs() {
        return this.prisma.analysis.findMany();
    }
}
