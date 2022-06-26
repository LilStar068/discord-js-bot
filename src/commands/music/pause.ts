import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DiscordClientJS } from "../../builders/client";

export default {
    command: new SlashCommandBuilder()
                        .setName('pause')
                        .setDescription('Pause the current playing song.'),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const player = client.MusicManager.players.get(interaction.guild.id)

        if (!player) {
            await interaction.reply({
                content: `There is no current song playing!`
            })
        }

        if (player.paused) {
            player.pause(false)
            
            return await interaction.reply({
                content: `Player is now resumed!`
            })
        };

        player.pause(true)

        await interaction.reply({
            content: `Player is now paused!`
        })
    }
}