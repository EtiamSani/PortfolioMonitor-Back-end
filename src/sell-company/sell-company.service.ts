import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SellCompanyDto } from './dto';

@Injectable()
export class SellCompanyService {
    constructor(private prisma: PrismaService){}

    async sellShareOfACompany(dto:SellCompanyDto, @Param('companyId') companyId: string){
        console.log(dto)
        try {
            const sellShareOfACompany = await this.prisma.sell.create({
                data: {
                    nature: dto.nature,
                    objective: dto.objective,
                    message: dto.message,
                    numberOfStocks: dto.numberOfStocks,
                    priceOfShare: dto.priceOfShare,
                    companyId: companyId
                },
            }
            )

            const companyWithPortfolio = await this.prisma.company.findUnique({
                where: {
                    id: companyId,
                },
                include: {
                    PortfolioCompany: {
                        include: {
                            portfolio: true,
                        },
                    },
                },
            });

           
            if (companyWithPortfolio && companyWithPortfolio.PortfolioCompany && companyWithPortfolio.PortfolioCompany.length > 0) {
                const portfolioId = companyWithPortfolio.PortfolioCompany[0].portfolio.id;
                const totalAmount = dto.priceOfShare * dto.numberOfStocks;
                await this.updateLiquidity(portfolioId, totalAmount);
            }
            const removedShareId = sellShareOfACompany.id
            this.removeShareToCompany(companyId,removedShareId)
            
            

            return sellShareOfACompany
            } catch(error) {
                console.log(error);
            throw new Error('Une erreur est survenue lors de la création de l\'entreprise et de la liaison au portefeuille.');
            }
    }

    async removeShareToCompany(@Param('companyId') companyId: string, removedShareId: string){
        
        const findCompany = await this.prisma.company.findUnique({
            where: {
                id: companyId
            }
        })
        if (findCompany) {
            const numberOfStocks = findCompany.numberOfStocks; 
            const getNumberOfselledShares = await this.prisma.sell.findUnique({
                where: {
                    id: removedShareId
                }
            })
            const numberOfselledShares = getNumberOfselledShares.numberOfStocks
            const removeBuyedStockToExistentStockInCompany = numberOfStocks - numberOfselledShares 
            const updateNumberOfSharesInCompany = await this.prisma.company.update({
                where: {
                    id: companyId
                },
                data: {
                    numberOfStocks: removeBuyedStockToExistentStockInCompany
                }
            })
            return updateNumberOfSharesInCompany
        }

    }
   

    async updateLiquidity(companyId: string, amount: number) {
        try {
            // Obtenez le portefeuille
            const portfolio = await this.prisma.portfolio.findFirst({
                where: {
                    id: companyId
                }
            });

            // Si le portefeuille existe
            if (portfolio) {
                const updatedLiquidity = portfolio.liquidity + amount;

                // Mettez à jour la liquidité dans la table Portfolio
                await this.prisma.portfolio.update({
                    where: {
                        id: companyId
                    },
                    data: {
                        liquidity: updatedLiquidity
                    }
                });

                return updatedLiquidity;
            } else {
                throw new Error('Le portefeuille n\'existe pas.');
            }
        } catch (error) {
            console.log(error);
            throw new Error('Une erreur est survenue lors de la mise à jour de la liquidité.');
        }
    }
}
