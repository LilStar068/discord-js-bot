import { ContextMenuCommandBuilder, time } from "@discordjs/builders";
import translate from "@iamtraction/google-translate";
import {
    MessageContextMenuInteraction,
} from "discord.js";
import { MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";

export default {
    command: new ContextMenuCommandBuilder()
        .setName("translate")
        .setType(3),
    async run(interaction: MessageContextMenuInteraction, client: DiscordClientJS) {
        const text: any = interaction.targetMessage || ''

        const embed = new MessageEmbed()
                            .setTitle(`Translate ${text}`)
                            .setColor('RANDOM')

        translate(text, { to: 'en' })
            .then(async (res) => {
                embed.description = `\`${text}\` => \`${res.text}\``
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                })
            })
            .catch((error) => {
                console.error(error.message)
            })
    },
};
