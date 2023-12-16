import { Injectable, Param } from '@nestjs/common';
import { CompanyDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService){}

    async createCompanyAndConnectToPortfolio(dto:CompanyDTO, @Param('ownerPortfolioId') ownerPortfolioId:string){
        console.log(dto)
        console.log(ownerPortfolioId, 'id portif')
            try {
                // Création de la nouvelle entreprise
                const createdCompany = await this.prisma.company.create({
                    data: {
                        name: dto.name,
                        ticker: dto.ticker,
                        currency: dto.currency,
                        type: dto.type,
                        capitalisation: dto.capitalisation,
                        per: dto.per,
                        low52: dto.low52,
                        high52: dto.high52,
                        volume: dto.volume,
                        numberOfStocks: dto.numberOfStocks,
                        pru: dto.pru,
                        stockCategory: dto.stockCategory,
                        gics: dto.gics,
                        country: dto.country,
                        annualDividend: dto.annualDividend,
                    },
                });
    
                // Association de l'entreprise au portfolio existant
                const portfolioCompany = await this.prisma.portfolioCompany.create({
                    data: {
                        createdAt: new Date(),
                        portfolio: { connect: { id: ownerPortfolioId } },
                        company: { connect: { id: createdCompany.id } },
                    },
                    include: {
                        company: true, // Pour récupérer les détails de l'entreprise créée
                    },
                });
    
                return portfolioCompany;
              } catch (error) {
            console.log(error);
            throw new Error('Une erreur est survenue lors de la création de l\'entreprise et de la liaison au portefeuille.');
        }
    }
}
