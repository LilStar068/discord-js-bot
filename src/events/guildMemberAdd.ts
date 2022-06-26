import { prisma } from '../prisma';
import { GuildMember, TextChannel } from 'discord.js';
import { parseMessage } from '../utils';

export default {
    name: 'guildMemberAdd',
    once: false,
    async run(member: GuildMember) {
        const guild = member.guild
        const prismaGuild = await prisma.guild.findUnique({ where: { guildId: guild.id } })

        if (!prismaGuild || !prismaGuild.welcomerEnabled) return;

        const message = parseMessage(prismaGuild.welcomerMessage, member)
        const channel = guild.channels.cache.get(prismaGuild.welcomerChannelId) as TextChannel

        await channel.send({
            content: message
        })
    }
}