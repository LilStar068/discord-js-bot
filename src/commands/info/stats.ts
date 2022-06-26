import { SlashCommandBuilder, time } from "@discordjs/builders";
import {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    version,
} from "discord.js";
import type { CommandInteraction } from "discord.js";
import { version as tsVersion } from "typescript";
import { DiscordClientJS } from "../../builders/client";

export default {
    command: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Get Stats of Bot."),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        await interaction.deferReply();
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle("LINK")
                .setURL("https://top.gg/bot/838686966387965992")
                .setLabel("Invite Me")
        );
        const embed = new MessageEmbed()
            .setTitle("Stats")
            .setColor("RANDOM")
            .setThumbnail(`${client.user.displayAvatarURL()}`)
            .addFields([
                {
                    name: ":arrow_up: Started",
                    value: `${time(
                        Math.floor(client.startTimeMS / 1000),
                        "R"
                    )}`,
                    inline: false,
                },
                {
                    name: ":ping_pong: Ping",
                    value: `\`\`\`${client.ws.ping}ms\`\`\``,
                    inline: true,
                },
                {
                    name: "<:djs:936654010277056564> Discord.js Version",
                    value: `\`\`\`${version}\`\`\``,
                    inline: true,
                },
                {
                    name: "<:typescript:936654542295158785> Typescript Version ",
                    value: `\`\`\`${tsVersion}\`\`\``,
                    inline: true,
                },
                {
                    name: "<:HomeServerLogo:843716672094339073> Total Servers",
                    value: `\`\`\`${client.guilds.cache.size}\`\`\``,
                    inline: true,
                },
                {
                    name: ":man: Total Users",
                    value: `\`\`\`${client.users.cache.size}\`\`\``,
                    inline: true,
                },
                {
                    name: "<:verifiedbotdev:730376320336265296> Developer",
                    value: `\`\`\`LilStar068#6960\`\`\``,
                    inline: true,
                },
            ]);
        await interaction.editReply({
            embeds: [embed],
            // components: [row]
        });
    },
};
