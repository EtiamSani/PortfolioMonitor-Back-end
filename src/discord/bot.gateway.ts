import { Injectable, Logger } from '@nestjs/common';
import { Once, InjectDiscordClient, On } from '@discord-nestjs/core';
import { Client, Message, TextChannel } from 'discord.js';

@Injectable()
export class BotGateway {
 
  private readonly logger = new Logger(BotGateway.name);
  private readonly channelId = '1186730472244531232'
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Once('ready')
  onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`);
  }

  @On('messageCreate')
  async onMessage(message: Message): Promise<void> {
    if (!message.author.bot) {
      await message.reply("I'm watching you");
      console.log(message.content);
    }
    // Si le message est envoyé dans le canal spécifique, ne rien faire pour éviter une boucle
    if (message.channelId === this.channelId) {
      return;
    }

    await this.sendNotification('Message envoyé dans ce canal spécifique!');
  }

  async sendNotification(content: string): Promise<void> {
    const channel = this.client.channels.cache.get(this.channelId);
    if (channel instanceof TextChannel) {
      const textChannel = channel as TextChannel;
      try {
        await textChannel.send(content);
        this.logger.log('Message envoyé avec succès dans le canal spécifique.');
      } catch (error) {
        this.logger.error('Erreur lors de l\'envoi du message dans le canal spécifique:', error);
      }
    } else {
      this.logger.error('Le canal spécifié n\'est pas un canal texte.');
    }
  }
}