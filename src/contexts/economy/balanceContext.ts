import { ContextMenuCommandBuilder, time } from "@discordjs/builders";
import {
    GuildMember,
    ContextMenuInteraction,
} from "discord.js";
import { MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";
import { prisma } from "../../prisma";
import { User } from "@prisma/client";

export default {
    command: new ContextMenuCommandBuilder()
        .setName("balance")
        .setType(2),
    async run(interaction: ContextMenuInteraction, client: DiscordClientJS) {
        const author = client.users.cache.get(interaction.targetId)
        
        let user: User = await prisma.user.findUnique({
            where: { userId: author.id },
        });

        if (!user || user === null) {
            user = await prisma.user.create({
                data: { userId: author.id },
            });
        } else {
            user = user;
        }

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${author.tag}'s Balance`,
                iconURL: author.displayAvatarURL(),
            })
            .addFields([
                {
                    name: "Wallet",
                    value: `${client.customEmojis.coin} ${user.wallet}`,
                    inline: true,
                },
                {
                    name: "Bank",
                    value: `${client.customEmojis.coin} ${user.bank}/${user.bankStorage}`,
                    inline: true,
                },
                {
                    name: "Net Worth",
                    value: `${client.customEmojis.coin} ${user.bank + user.wallet}`,
                    inline: true,
                },
            ])
            .setThumbnail(author.displayAvatarURL())
            .setColor("RANDOM");

        await interaction.reply({
            embeds: [embed],
        });
    },
};
