import { Injectable, Param } from '@nestjs/common';
import { CompanyDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService){}

    async createCompanyAndConnectToPortfolio(dto:CompanyDTO, @Param('ownerPortfolioId') ownerPortfolioId:string){
            try {
                // Création de la nouvelle entreprise
                const createdCompany = await this.prisma.company.create({
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
}