import { Injectable, Param } from '@nestjs/common';
import { CompanyDTO, updateCompanyDividendsDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService){}

    async createCompanyAndConnectToPortfolio(dto:CompanyDTO, @Param('ownerPortfolioId') ownerPortfolioId:string){
    
            try {
                const stockPrice = await this.fetchStockPrice(dto.ticker);
                const calculatedValues = await this.calculateStockValues(dto,stockPrice)
                const ticker = dto.ticker
                let sanitizedTicker = ticker.split(':');
                let stockCode = sanitizedTicker[1];
                const createdCompany = await this.prisma.company.create({
                    data: {
                        logo: `/company-logos/${stockCode}.png`,
                        name: dto.name,
                        ticker: dto.ticker,
                        currency: dto.currency,
                        type: dto.type,
                        capitalisation: dto.capitalisation,
                        numberOfStocks: dto.numberOfStocks,
                        pru: dto.pru,
                        currentStockPrice: stockPrice,
                        pruValue:calculatedValues.pruValue,
                        marketValue:calculatedValues.marketValue,
                        gainOrLoss:calculatedValues.gainOrLoss,
                        pvMvPercentage:parseFloat(calculatedValues.pvMvPercentage),
                        stockCategory: dto.stockCategory,
                        gics: dto.gics,
                        country: dto.country,
                        dividendsReceived:dto.dividendsReceived
                        
                    },
                });

               
                    
                    const totalAmount = createdCompany.currentStockPrice * dto.numberOfStocks;
                    await this.updateLiquidity(ownerPortfolioId, totalAmount);
                
    
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

async calculateStockValues(dto: any, stockPrice:any) {
    
    const { numberOfStocks, pru } = dto;
    let { dividendsReceived } = dto; 

        if (dividendsReceived == undefined){
            dividendsReceived = 0
           
        }

    // Calcul de la valeur PRU
    const pruValue = numberOfStocks * pru;

    // Calcul de la valeur de marché
    const marketValue = numberOfStocks * stockPrice;

    // Calcul du gain ou de la perte
    const gainOrLoss = marketValue - pruValue;

    // Calcul du pourcentage de PV/MV
    const unformattedPvMvPercentage = (((marketValue + dividendsReceived) - pruValue) / pruValue) * 100;
    const pvMvPercentage = unformattedPvMvPercentage.toFixed(2);
  
    return {
        pruValue,
        marketValue,
        gainOrLoss,
        pvMvPercentage,
    };
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

async updateDividendsReceived(dto:updateCompanyDividendsDTO, @Param('companyId') companyId:string) {
    try {
        const updatedCompany = await this.prisma.company.update({
            where: {
                id: companyId, // Utilisation de l'ID pour cibler l'entreprise spécifique à mettre à jour
            },
            data: {
                dividendsReceived: dto.dividendsReceived,
            },
        });
        const findCompany = await this.prisma.company.findUnique({
            where: {
                id: companyId
            }
        })
        
        const calculatedPvMvPercentageWithDivdendIncluded = await this.calculatePvMvPercentagesWithDividendIncluded(dto,findCompany)
        await this.updateCompanyPvMvToIncludeDividends(calculatedPvMvPercentageWithDivdendIncluded,companyId)
        await this.addDividendsToLiquidity(companyId,dto.dividendsReceived)
        return updatedCompany
    } catch (error) {
        console.log(error);
        throw new Error('Une erreur est survenue lors de la mise a jour de l\'entreprise.');
    }
}

async calculatePvMvPercentagesWithDividendIncluded(dto: any, findCompany:any) {


    const {currentStockPrice, numberOfStocks, pru} = findCompany
   
    let { dividendsReceived } = dto; 



    // Calcul de la valeur PRU
    const pruValue = numberOfStocks * pru;

    // Calcul de la valeur de marché
    const marketValue = numberOfStocks * currentStockPrice;


    // Calcul du pourcentage de PV/MV
    const unformattedPvMvPercentage = (((marketValue + dividendsReceived) - pruValue) / pruValue) * 100;
    const pvMvPercentage = unformattedPvMvPercentage.toFixed(2);
   
  
    return pvMvPercentage

}

async updateCompanyPvMvToIncludeDividends(calculatedPvMvPercentageWithDivdendIncluded: any, @Param('companyId') companyId:string) {
    try {
        const updatedCompany = await this.prisma.company.update({
            where: {
                id: companyId,
            },
            data: {
                pvMvPercentage: parseFloat(calculatedPvMvPercentageWithDivdendIncluded),
                
            },
        });
        return updatedCompany
    } catch (error) {
        console.log(error);
        throw new Error('Une erreur est survenue lors de la mise a jour de l\'entreprise.');
    }
}

async addDividendsToLiquidity(companyId: string, amount: number) {
    console.log(companyId)
    
    
    try {
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
        const portfolioId = companyWithPortfolio.PortfolioCompany[0].portfolio.id;
        // Obtenez le portefeuille
        
        const portfolio = await this.prisma.portfolio.findFirst({
            where: {
                id: portfolioId
            }
        });
        console.log(portfolio, 'portfolio')
        // Si le portefeuille existe
        if (portfolio) {
            const updatedLiquidity = portfolio.liquidity + amount;

            // Mettez à jour la liquidité dans la table Portfolio
            const updatedLiquidityAfterDividends = await this.prisma.portfolio.updateMany({
                where: {
                    id: portfolioId
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