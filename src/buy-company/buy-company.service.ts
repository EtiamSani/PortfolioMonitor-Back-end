import { Body, Injectable, Param } from '@nestjs/common';
import { BuyCompanyDto } from './dto/buy-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BuyCompanyService {
    constructor(private prisma: PrismaService){}
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
            const addedShareId = buyNewShareOfACompany.id
            this.addNewBoughtShareToCompany(companyId,addedShareId)
            this.updatePru(companyId, dto.newPru)
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
}
