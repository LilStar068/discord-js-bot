import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DiscordClientJS } from "../../builders/client";

export default {
    command: new SlashCommandBuilder()
                        .setName('stop')
                        .setDescription('Skip the current playing song.'),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const player = client.MusicManager.players.get(interaction.guild.id)

        if (!player) {
            await interaction.reply({
                content: `There is no current song playing!`
            })
        }

        await interaction.reply({
            content: `Stoping the current player.`
        })

        player.destroy()
    }
}