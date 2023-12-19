import { Body, Injectable, Param } from '@nestjs/common';
import { BuyCompanyDto } from './dto/buy-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BotGateway } from 'src/discord/bot.gateway';

@Injectable()
export class BuyCompanyService {
    constructor(private prisma: PrismaService,
        private botGateway: BotGateway){}
    async buyNewShareOfACompany(dto:BuyCompanyDto, @Param('companyId') companyId: string){
        console.log(dto)
        try {
            const buyNewShareOfACompany = await this.prisma.buy.create({
                data: {
                    nature: dto.nature,
                    objective: dto.objective,
                    message: dto.message,
                    numberOfStocks: dto.numberOfStocks,
                    newPru: dto.newPru,
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
            const addedShareId = buyNewShareOfACompany.id
            this.addNewBoughtShareToCompany(companyId,addedShareId)
            this.updatePru(companyId, dto.newPru)
            
            const message = `Achat de ${dto.numberOfStocks} ${dto.nature} au prix de ${dto.priceOfShare} ! Motivation : ${dto.objective}. Commentaire : ${dto.message}. Nouveau PRU ${dto.newPru}.`;
            this.botGateway.sendNotification(message); 
            return buyNewShareOfACompany
            } catch(error) {
                console.log(error);
            throw new Error('Une erreur est survenue lors de la création de l\'entreprise et de la liaison au portefeuille.');
            }
    }

    async addNewBoughtShareToCompany(@Param('companyId') companyId: string, addedShareId: string){
        
        const findCompany = await this.prisma.company.findUnique({
            where: {
                id: companyId
            }
        })
        if (findCompany) {
            const numberOfStocks = findCompany.numberOfStocks; 
            const getNumberOfBoughtShares = await this.prisma.buy.findUnique({
                where: {
                    id: addedShareId
                }
            })
            const numberOfBoughtShares = getNumberOfBoughtShares.numberOfStocks
            const addingBuyedStockToExistentStockInCompany = numberOfStocks + numberOfBoughtShares 
            const updateNumberOfSharesInCompany = await this.prisma.company.update({
                where: {
                    id: companyId
                },
                data: {
                    numberOfStocks: addingBuyedStockToExistentStockInCompany
                }
            })
            return updateNumberOfSharesInCompany
        }

    }
    async updatePru(@Param('companyId') companyId: string, newPru: number){
        const findCompany = await this.prisma.company.update({
            where: {
                id: companyId
            },
            data: {
                pru: newPru
            }
        })
        return findCompany
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
                const updatedLiquidity = portfolio.liquidity - amount;

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
