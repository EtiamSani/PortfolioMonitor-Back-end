import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SellCompanyDto } from './dto';
import { BotGateway } from 'src/discord/bot.gateway';

@Injectable()
export class SellCompanyService {
    constructor(private prisma: PrismaService,
        private botGateway: BotGateway){}

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
            const getReturnOfSelledShare = await this.removeShareToCompany(companyId,removedShareId)
            console.log(getReturnOfSelledShare, 'getReturnOfSelledShare')
            const currentStockPrice = getReturnOfSelledShare.currentStockPrice
            const updateNumberOfSharesInCompany = getReturnOfSelledShare.numberOfStocks
            const companyCurrentPru = getReturnOfSelledShare.pru
            const calculatedValues = await this.calculateStockValues(dto,currentStockPrice,updateNumberOfSharesInCompany,companyCurrentPru)
            await this.updateCompanyWithCalculatedValues(companyId, calculatedValues);
            
            const message = `__**Vente :**__ de ${dto.numberOfStocks} nouvel action(s) de **${dto.nature}** au prix de ${dto.priceOfShare} € ! \n **Motivation :** ${dto.objective}. \n **Commentaire :** ${dto.message}.`;
            this.botGateway.sendNotification(message); 
            

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

    async calculateStockValues(dto: any, currentStockPrice:any,updateNumberOfSharesInCompany:any,companyCurrentPru:any ) {
        
       
        let { dividendReceived } = dto; 

        if (dividendReceived == undefined){
            dividendReceived = 0
           
        }
    
        // Calcul de la valeur PRU
        const pruValue = updateNumberOfSharesInCompany * companyCurrentPru;
    
        // Calcul de la valeur de marché
        const marketValue = updateNumberOfSharesInCompany * currentStockPrice;
    
        // Calcul du gain ou de la perte
        const gainOrLoss = marketValue - pruValue;
    
    
        // Calcul du pourcentage de PV/MV
        const unformattedPvMvPercentage = (((marketValue + dividendReceived) - pruValue) / pruValue) * 100;
        const pvMvPercentage = unformattedPvMvPercentage.toFixed(2);
        
        
        return {
            pruValue,
            marketValue,
            gainOrLoss,
            pvMvPercentage,
        };
    }

    async updateCompanyWithCalculatedValues(companyId: string, calculatedValues: any) {
       
        try {
            const updatedCompany = await this.prisma.company.update({
                where: {
                    id: companyId,
                },
                data: {
                    pruValue: calculatedValues.pruValue,
                    marketValue: calculatedValues.marketValue,
                    gainOrLoss: calculatedValues.gainOrLoss,
                    pvMvPercentage: parseFloat(calculatedValues.pvMvPercentage),

                },
            });
            return updatedCompany;
        } catch (error) {
            console.log(error);
            throw new Error('Une erreur est survenue lors de la mise à jour des valeurs calculées dans la table company.');
        }
    }
}
