import { Body, Injectable, Param } from '@nestjs/common';
import { BuyCompanyDto } from './dto/buy-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BuyCompanyService {
    constructor(private prisma: PrismaService){}
    async buyNewShareOfACompany(@Param('companyId') companyId: string, @Body() dto:BuyCompanyDto){
        try {
            console.log(dto)
            const buyNewShareOfACompany = await this.prisma.buy.create({
                data: {
                    nature: dto.nature,
                    objective: dto.objective,
                    message: dto.message,
                    numberOfStocks: dto.numberOfStocks,
                    newPru: dto.newPru,
                    companyId: companyId
                },
            }
            )
            return buyNewShareOfACompany
            } catch(error) {
                console.log(error);
            throw new Error('Une erreur est survenue lors de la création de l\'entreprise et de la liaison au portefeuille.');
            }
    }
}
