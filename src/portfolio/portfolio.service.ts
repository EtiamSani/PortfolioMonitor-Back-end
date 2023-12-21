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

    async getPortfolioWithCompanies(@Param('portfolioOwnerId') portfolioOwnerId: string){
        try {
            const getPortfolioNames = await this.prisma.portfolio.findMany({
                where: {
                    portfolioOwnerId:portfolioOwnerId
                },
                include: {
                    PortfolioCompany: { 
                        include: {
                            company: true 
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc' 
                }
            })
            
            return getPortfolioNames
        } catch (error) {
            console.log(error)
        }
    }

    async modificationOfPortfolio(@Param('portfolioId') portfolioId: string, dto:PortfolioDto){

        console.log(dto)
        try {
            const updatedFields = {};
    
            if (dto.moneyInput !== undefined) {
                updatedFields['moneyInput'] = dto.moneyInput;

                const portfolio = await this.prisma.portfolio.findUnique({
                    where: { id: portfolioId },
                    select: {moneyInput: true, liquidity: true },
                });

                const currentMoneyInput = portfolio.moneyInput || 0; 
                const updatedMoneyInput = currentMoneyInput + dto.moneyInput; // Nouvelle valeur de moneyInput

                updatedFields['moneyInput'] = updatedMoneyInput
                const updatedLiquidity = (portfolio.liquidity || 0) + dto.moneyInput;
                updatedFields['liquidity'] = updatedLiquidity;

            }

    
            if (dto.liquidity !== undefined) {
                updatedFields['liquidity'] = dto.liquidity;
            }
    
            if (dto.gainOrLost !== undefined) {
                updatedFields['gainOrLost'] = dto.gainOrLost;
            }
    
            if (dto.portfolioValue !== undefined) {
                updatedFields['portfolioValue'] = dto.portfolioValue;
            }
            
    
            // Mise à jour sélective des champs spécifiés
            const updatedPortfolio = await this.prisma.portfolio.update({
                where: { id: portfolioId },
                data: updatedFields,
            });
    
            return updatedPortfolio;

        } catch (error) {
            console.error(error)
        }
    }

    async getPortfolioById(@Param('portfolioId') portfolioId: string){
       
        try {
            const findPortfolioById = await this.prisma.portfolio.findUnique({
                where: {
                    id: portfolioId
                }
            });
    
            const getPortfolioNames = await this.prisma.portfolio.findMany({
                where: {
                    portfolioOwnerId: findPortfolioById.portfolioOwnerId
                },
                include: {
                    PortfolioCompany: { 
                        include: {
                            company: true 
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc' 
                }
            });
            
            const portfolioValue = await this.calculatePortfolioPerformance(getPortfolioNames);
            console.log(portfolioValue, 'in getportfoliobyID')
            await this.updateOrInsertPortfolioValue(portfolioValue, portfolioId);
            return findPortfolioById
        } catch (error) {
            console.error(error)
        }
    }

    async calculatePortfolioPerformance(getPortfolioNames:any){
        try {
            const allMarketValues = getPortfolioNames.flatMap(portfolio => 
                portfolio.PortfolioCompany.map(portfolioCompany => portfolioCompany.company.marketValue)
            );
            const sumOfMarketValues = allMarketValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return sumOfMarketValues
        } catch (error) {
            console.error(error)
        }
    }
    
// TODO quand je change d'onglet, le deuxieme pf est mis a jour avec la meme valeur
    async updateOrInsertPortfolioValue(portfolioValue: number, portfolioId: string) {
        try {
            // Récupérer le portefeuille associé à cet ID de propriétaire
            const existingPortfolio = await this.prisma.portfolio.findUnique({
                where: {
                    id: portfolioId,
                },
            });
    
            if (existingPortfolio) {
                // Si le portefeuille existe, vérifiez si la valeur est différente
                if (existingPortfolio.portfolioValue !== portfolioValue) {
                    // Mettre à jour la valeur du portefeuille
                    const updatedPortfolio = await this.prisma.portfolio.update({
                        where: {
                            id: existingPortfolio.id,
                        },
                        data: {
                            portfolioValue: portfolioValue,
                        },
                    });
                    console.log(updatedPortfolio, 'updatePfvalue')
                    return updatedPortfolio;
                } else {
                    // Si la valeur est la même, retourner simplement le portefeuille existant
                    return existingPortfolio;
                }
            } 
        } catch (error) {
            console.error(error);
            throw new Error('Une erreur est survenue lors de la mise à jour/ de la valeur du portefeuille.');
        }
    }

    async calculatePortfolioMarketValue(@Param('portfolioId') portfolioId: string){
        try {
            const getPortfolios = await this.prisma.portfolio.findMany({
                where: {
                    id:portfolioId
                },
                include: {
                    PortfolioCompany: { 
                        include: {
                            company: true 
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc' 
                }
            })

    
             let totalMarketValue = 0;
            console.log(getPortfolios)
        getPortfolios.forEach(portefeuille => {
            portefeuille.PortfolioCompany.forEach(entreprise => {
                totalMarketValue += entreprise.company.marketValue;
            });
        });

        // Vous pouvez retourner la somme totale ou faire ce que vous voulez avec cette valeur
        return totalMarketValue;
        } catch (error) {
            console.log(error)
        }
    }
    
}
