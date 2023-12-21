import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SharesTransactionsService {
    constructor(private prisma: PrismaService){}

    async getAllBoughtShares(){
        try {
            const getAllBoughtShares = await this.prisma.buy.findMany({
              take: 3, 
              orderBy: { createdAt: 'desc' }, 
            });
            return getAllBoughtShares;
          } catch (error) {
            console.error(error);
            throw error; 
          }
    }

    async getAllSoldShares(){
        try {
            const getAllSoldedShares = await this.prisma.sell.findMany({
              take: 3, 
              orderBy: { createdAt: 'desc' }, 
            });
            return getAllSoldedShares;
          } catch (error) {
            console.error(error);
            throw error; 
          }
    }
}
