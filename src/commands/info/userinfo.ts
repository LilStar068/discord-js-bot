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
        .setName("userinfo")
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
                name: `${author.tag}`,
                iconURL: author.displayAvatarURL(),
            })
            .setTitle(`User Info for ${author.tag}`)
            .addFields([
                {
                    name: "ID",
                    value: `\`${author.id}\``,
                    inline: true,
                },
                {
                    name: "Created At",
                    value: `${time(author.createdAt, "R")}`,
                    inline: true,
                },
                {
                    name: "RPS Wins",
                    value: `${user.rps_wins}`,
                    inline: true,
                },
                {
                    name: "RPS Losses",
                    value: `${user.rps_losses}`,
                    inline: true,
                },
                {
                    name: "RPS Ties",
                    value: `${user.rps_ties}`,
                    inline: true,
                },
                {
                    name: "RPS Games",
                    value: `${user.rps_wins + user.rps_losses + user.rps_ties}`,
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
