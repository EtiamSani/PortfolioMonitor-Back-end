import { Module } from '@nestjs/common';
import { AuthPortfolioOwnerModule } from './auth-portfolio-owner/auth-portfolio-owner.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CompanyModule } from './company/company.module';
import { BuyCompanyModule } from './buy-company/buy-company.module';
import { SellCompanyModule } from './sell-company/sell-company.module';
import { DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';
import { BotGateway } from './discord/bot.gateway';
import { DiscordConfigService } from './discord/discord-config.service';
import { SharesTransactionsModule } from './shares-transactions/shares-transactions.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OwnerAnalysisModule } from './owner-analysis/owner-analysis.module';

const config = new ConfigService();
@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }),
  DiscordModule.forRootAsync({
    useFactory: () => ({
      token: config.get('DISCORD_TOKEN'),
      discordClientOptions: {
        intents: [GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers,
        ],
      },
    }),
  }),
    AuthPortfolioOwnerModule,
    PrismaModule,
    PortfolioModule,
    CompanyModule,
    BuyCompanyModule,
    SellCompanyModule,
    DiscordModule,
    SharesTransactionsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), 
       // L'URL à laquelle les ressources statiques seront servies
    }),
    OwnerAnalysisModule,
  ],
  providers:[BotGateway]
})
export class AppModule {}
