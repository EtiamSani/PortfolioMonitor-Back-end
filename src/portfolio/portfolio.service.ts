import { Injectable} from '@nestjs/common';
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
}
