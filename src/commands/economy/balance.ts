import { SlashCommandBuilder, time } from "@discordjs/builders";
import {
    CommandInteraction,
    GuildMember,
} from "discord.js";
import { MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";
import { prisma } from "../../prisma";
import { User } from "@prisma/client";

export default {
    command: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Get information on yourself or another user.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user")
                .setRequired(false)
        ),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const intUser = interaction.options.getUser("user", false) ? interaction.options.getUser("user", false) : interaction.user;

        let author = client.users.cache.get(intUser.id);

        let user: User = await prisma.user.findUnique({
            where: { userId: author.id },
        });

        if (!user) {
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
