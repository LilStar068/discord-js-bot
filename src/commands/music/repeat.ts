import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DiscordClientJS } from "../../builders/client";

export default {
    command: new SlashCommandBuilder()
                        .setName('repeat')
                        .setDescription('Repeat the current playing song.'),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const player = client.MusicManager.players.get(interaction.guild.id)

        if (!player) {
            await interaction.reply({
                content: `There is no current song playing!`
            })
        }

        if (player.queueRepeat) {
            player.setQueueRepeat(false)
            
            return await interaction.reply({
                content: `Player is no longer in repeat!`
            })
        };

        player.setQueueRepeat(true)

        await interaction.reply({
            content: `Player will now repeat the current playing song!`
        })
    }
}