import { Module } from '@nestjs/common';
import { BuyCompanyService } from './buy-company.service';
import { BuyCompanyController } from './buy-company.controller';
import { DiscordModule } from '@discord-nestjs/core';
import { BotGateway } from 'src/discord/bot.gateway';
import { BotModule } from 'src/discord/bot-module';

@Module({
  imports: [BotModule],
  providers: [BuyCompanyService],
  controllers: [BuyCompanyController]
})
export class BuyCompanyModule {}
