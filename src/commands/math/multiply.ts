import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction, GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";

export default {
    command: new SlashCommandBuilder()
        .setName("multiply")
        .setDescription("Multiply numbers")
        .addNumberOption((option) =>
            option
                .setName("number-1")
                .setDescription("The first number")
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName("number-2")
                .setDescription("The Second number")
                .setRequired(true)
        ),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const number1 = interaction.options.getNumber("number-1");
        const number2 = interaction.options.getNumber("number-2");
        const author = interaction.member as GuildMember;

        const emb = new MessageEmbed()
            .setTitle(`Multiplication of ${number1} x ${number2}`)
            .setDescription(`${number1} x ${number2} = ${number1 * number2}`)
            .setFooter({
                text: `Requested by: ${author.user.tag}`,
                iconURL: author.user.displayAvatarURL(),
            })
            .setColor("RANDOM");
        await interaction.reply({ embeds: [emb] });
    },
};
