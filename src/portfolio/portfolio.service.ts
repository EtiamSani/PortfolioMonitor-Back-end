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
                    id:portfolioId
                }
            })
            return findPortfolioById
        } catch (error) {
            
        }
    }
}
