import {ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class AuthPortfolioOwnerService {
    constructor(private prisma: PrismaService, private config: ConfigService, private jwt: JwtService,) {}

    async signup(dto : AuthDto){
        const hash = await argon.hash(dto.password);
        try{
            const portfolioOwner = await this.prisma.portfolioOwner.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    password: hash,
                    isOwner: true
                },
            });
            return this.signToken(portfolioOwner.id, portfolioOwner.email);

        } catch (error) {
            if (
              error instanceof
              PrismaClientKnownRequestError
            ) {
              if (error.code === 'P2002') {
                throw new ForbiddenException(
                  'Credentials taken',
                );
              }
            }
            throw error;
          }
    }

    async signin(dto: AuthDto) {
       
        const portfolioOwner =
          await this.prisma.portfolioOwner.findUnique({
            where: {
              email: dto.email,
            },
          });
        
        if (!portfolioOwner)
          throw new ForbiddenException(
            'Credentials incorrect',
          );
    
      
        const passWordMatches = await argon.verify(
            portfolioOwner.password,
          dto.password,
        );
       
        if (!passWordMatches)
          throw new ForbiddenException(
            'Credentials incorrect',
          );
        return this.signToken(portfolioOwner.id, portfolioOwner.email);
      }
    
      async signToken(
        userId: string,
        email: string,
      ): Promise<{ access_token: string }> {
        const payload = {
          sub: userId,
          email,
        };
        const secret = this.config.get('JWT_SECRET');
        
    
        const token = await this.jwt.signAsync(
          payload,
          {
            expiresIn: '15m',
            secret: secret,
          },
        );
    
        return {
          access_token: token,
        };
    }
}
