import { Module } from '@nestjs/common';
import { BuyCompanyService } from './buy-company.service';
import { BuyCompanyController } from './buy-company.controller';
import { DiscordModule } from '@discord-nestjs/core';
import { BotGateway } from 'src/discord/bot.gateway';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [BuyCompanyService, BotGateway],
  controllers: [BuyCompanyController]
})
export class BuyCompanyModule {}
