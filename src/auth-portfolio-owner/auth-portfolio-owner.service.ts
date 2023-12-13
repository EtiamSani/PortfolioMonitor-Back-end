import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthPortfolioOwnerService {
    constructor(private prisma: PrismaService) {}

    async signup(dto : AuthDto){
        const portfolioOwner = await this.prisma.portfolioOwner.create({
            data: {
                username: dto.username,
                email: dto.email,
                isEmailValid: dto.isEmailValid,
                isOwner: dto.isOwner,
                verifyToken: dto.verifyToken,
                password: dto.password,
            },
        });
        return portfolioOwner;
    }
}
