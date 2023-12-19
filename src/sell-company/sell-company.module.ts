import { Module } from '@nestjs/common';
import { SellCompanyController } from './sell-company.controller';
import { SellCompanyService } from './sell-company.service';
import { DiscordModule } from '@discord-nestjs/core';
import { BotGateway } from 'src/discord/bot.gateway';

@Module({
  imports: [DiscordModule.forFeature()],
  controllers: [SellCompanyController],
  providers: [SellCompanyService,BotGateway]
})
export class SellCompanyModule {}
