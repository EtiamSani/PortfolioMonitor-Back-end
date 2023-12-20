import { Module } from '@nestjs/common';
import { SellCompanyController } from './sell-company.controller';
import { SellCompanyService } from './sell-company.service';
import { DiscordModule } from '@discord-nestjs/core';
import { BotGateway } from 'src/discord/bot.gateway';
import { BotModule } from 'src/discord/bot-module';

@Module({
  imports: [BotModule],
  controllers: [SellCompanyController],
  providers: [SellCompanyService]
})
export class SellCompanyModule {}
