import { Body, Injectable, Param } from '@nestjs/common';
import { BuyCompanyDto } from './dto/buy-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BotGateway } from 'src/discord/bot.gateway';

@Injectable()
export class BuyCompanyService {
    constructor(private prisma: PrismaService,
        private botGateway: BotGateway){}
    async buyNewShareOfACompany(dto:BuyCompanyDto, @Param('companyId') companyId: string){
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
            const getReturnOfAddNewBoughtShare = await this.addNewBoughtShareToCompany(companyId,addedShareId)
            const currentStockPrice = getReturnOfAddNewBoughtShare.currentStockPrice
    
            const updateNumberOfSharesInCompany = getReturnOfAddNewBoughtShare.numberOfStocks
            
            this.updatePru(companyId, dto.newPru)
            const calculatedValues = await this.calculateStockValues(dto,currentStockPrice,updateNumberOfSharesInCompany)
            // il faut mainteant stocker ces nouvelle valeur dans la table
            await this.updateCompanyWithCalculatedValues(companyId, calculatedValues);
            
            const message = `__**Achat :**__ de ${dto.numberOfStocks} nouvel action(s) de **${dto.nature}** au prix de ${dto.priceOfShare} € ! \n **Motivation :** ${dto.objective}. \n **Commentaire :** ${dto.message}.\n **Nouveau PRU :** ${dto.newPru} €.`;
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

    async calculateStockValues(dto: any, currentStockPrice:any,updateNumberOfSharesInCompany:any ) {
        
        const { newPru } = dto;
        let { dividendReceived } = dto; 

        if (dividendReceived == undefined){
            dividendReceived = 0
           
        }
    
        // Calcul de la valeur PRU
        const pruValue = updateNumberOfSharesInCompany * newPru;
    
        // Calcul de la valeur de marché
        const marketValue = updateNumberOfSharesInCompany * currentStockPrice;
    
        // Calcul du gain ou de la perte
        const gainOrLoss = marketValue - pruValue;
    
    
        // Calcul du pourcentage de PV/MV
        const pvMvPercentage = (((marketValue + dividendReceived) - pruValue) / pruValue) * 100;
        
        
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
                    pvMvPercentage: calculatedValues.pvMvPercentage,

                },
            });
            return updatedCompany;
        } catch (error) {
            console.log(error);
            throw new Error('Une erreur est survenue lors de la mise à jour des valeurs calculées dans la table company.');
        }
    }

}
