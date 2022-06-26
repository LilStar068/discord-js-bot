import { SlashCommandBuilder } from "@discordjs/builders";
import {
    CommandInteraction,
    GuildMember,
    MessageActionRow,
    MessageButton,
} from "discord.js";
import { MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";

export default {
    command: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Magic 8ball shall answer wour question!")
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("The question to be answered")
                .setRequired(true)
        ),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const author = interaction.member as GuildMember;
        const _8ballResponses: string[] = [
            "As I see it, yes.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "It is certain.",
            "It is decidedly so.",
            "Most likely.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Outlook good.",
            "Reply hazy, try again.",
            "Signs point to yes.",
            "Very doubtful.",
            "Without a doubt.",
            "Yes.",
            "Yes - definitely.",
            "You may rely on it.",
        ];

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${author.user.username}`,
                iconURL: `${author.user.displayAvatarURL()}`,
            })
            .setTitle("Magic 8ball!")
            .addFields([
                {
                    name: "Question",
                    value: `${interaction.options.getString("question")}`,
                    inline: false,
                },
                {
                    name: "Answer",
                    value: `${
                        _8ballResponses[
                            Math.floor(Math.random() * _8ballResponses.length)
                        ]
                    }`,
                    inline: false,
                },
            ])
            .setColor("RANDOM");
        await interaction.reply({
            embeds: [embed],
        });
    },
};
