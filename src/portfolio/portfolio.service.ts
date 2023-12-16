import { Injectable, Param} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PortfolioDto } from './dto';


@Injectable()
export class PortfolioService {
    constructor(private prisma: PrismaService){}

    async creatPortfolio(dto:PortfolioDto){
        try {
             const createdPortfolio = await this.prisma.portfolio.create({
                data: {
                    name: dto.name,
                    portfolioOwnerId: dto.portfolioOwnerId,
                }
            })
            return createdPortfolio
        } catch (error) {
            console.log(error)
        }
    }

    async getPortfolioNames(@Param('portfolioOwnerId') portfolioOwnerId: string){

        try {
            const getPortfolioNames = await this.prisma.portfolio.findMany({
                where: {
                    portfolioOwnerId:portfolioOwnerId
                }
            })
            return getPortfolioNames
        } catch (error) {
            console.log(error)
        }
    }
}
