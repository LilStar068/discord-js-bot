import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DiscordClientJS } from "../../builders/client";

export default {
    command: new SlashCommandBuilder()
                        .setName('play')
                        .setDescription('Play a song.')
                        .addStringOption((option) => (
                            option
                                .setName('song')
                                .setDescription('The song to be played.')
                                .setRequired(true)
                        )),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const song = interaction.options.getString('song')
        const guild = interaction.guild
        const author = guild.members.cache.get(interaction.user.id)
        
        if (!author.voice.channel) {
            return await interaction.reply({
                content: `You need to join a voice channel first!`,
                ephemeral: true,
            })
        }

        const res = await client.MusicManager.search(song, author)

        const player = client.MusicManager.create({
            guild: interaction.guild.id,
            voiceChannel: author.voice.channel.id,
            textChannel: interaction.channel.id,
        })

        player.connect()

        player.queue.add(res.tracks[0])

        await interaction.reply({
            content: `Enqueing track ${res.tracks[0].title}.`
        })

        if (!player.playing && !player.paused && !player.queue.size) player.play()
    }
}