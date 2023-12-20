import { Injectable, Param } from '@nestjs/common';
import { CompanyDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService){}

    async createCompanyAndConnectToPortfolio(dto:CompanyDTO, @Param('ownerPortfolioId') ownerPortfolioId:string){
        console.log('dto', dto)
            try {
                const stockPrice = await this.fetchStockPrice(dto.ticker);
                const createdCompany = await this.prisma.company.create({
                    data: {
                        name: dto.name,
                        ticker: dto.ticker,
                        currency: dto.currency,
                        type: dto.type,
                        capitalisation: dto.capitalisation,
                        numberOfStocks: dto.numberOfStocks,
                        pru: dto.pru,
                        currentStockPrice: stockPrice,
                        stockCategory: dto.stockCategory,
                        gics: dto.gics,
                        country: dto.country,
                        
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

    async deleteCompanyAndDisconnectFromPortfolio(companyId: string) {
        try {
            // Vérifier si l'entreprise existe
            const company = await this.prisma.company.findUnique({
                where: { id: companyId },
            });
            
            console.log('Company found:', company);
            if (!company) {
                throw new Error('Entreprise non trouvée.');
            }
    
            // Supprimer l'association avec le portfolio
            await this.prisma.portfolioCompany.deleteMany({
                where: { companyId },
            });
    
            // Supprimer l'entreprise
            const deletedCompany = await this.prisma.company.delete({
                where: { id: companyId },
            });
    
            return deletedCompany;
        } catch (error) {
            console.log(error);
            throw new Error('Une erreur est survenue lors de la suppression de l\'entreprise.');
        }
    }

    async updateCompany(dto:CompanyDTO, @Param('companyId') companyId:string) {
        try {
            const updatedCompany = await this.prisma.company.update({
                where: {
                    id: companyId, // Utilisation de l'ID pour cibler l'entreprise spécifique à mettre à jour
                },
                data: {
                    name: dto.name,
                    ticker: dto.ticker,
                    currency: dto.currency,
                    type: dto.type,
                    capitalisation: dto.capitalisation,
                    numberOfStocks: dto.numberOfStocks,
                    pru: dto.pru,
                    stockCategory: dto.stockCategory,
                    gics: dto.gics,
                    country: dto.country,
                },
            });
            return updatedCompany
        } catch (error) {
            console.log(error);
            throw new Error('Une erreur est survenue lors de la mise a jour de l\'entreprise.');
        }
    }

async fetchStockPrice(ticker: string): Promise<number> {
    try {
        const apiUrl = `https://api.gurufocus.com/public/user/${process.env.GURUFOCUS_TOKEN}/stock/${ticker}/quote`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Impossible de récupérer le prix de l\'action');
        }
        const data = await response.json();
        const stockPrice = data.Price;
        return stockPrice;
    } catch (error) {
        console.error('Erreur lors de la récupération du prix de l\'action :', error);
        throw new Error('Une erreur est survenue lors de la récupération du prix de l\'action');
    }
}

}