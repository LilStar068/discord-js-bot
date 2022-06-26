import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Guild, GuildMember, MessageEmbed } from "discord.js";
import { ms } from "../../utils";
import { DiscordClientJS } from "../../builders/client";

export default {
    command: new SlashCommandBuilder()
                        .setName('search')
                        .setDescription('Search a song.')
                        .addStringOption((option) => (
                            option
                                .setName('song')
                                .setDescription('The song to search for.')
                                .setRequired(true)
                        )),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        await interaction.deferReply()
        const query = interaction.options.getString('song');
        const results = await client.MusicManager.search(query, interaction.member)
        const tracks = results.tracks.slice(0, 10)

        let resultDescription = '';
        let counter = 1;

        for (const track of tracks) {
            resultDescription += `${counter}) [${track.title}](${track.uri})\n`
            counter++
        }

        const embed = new MessageEmbed()
                            .setTitle('Results')
                            .setDescription(resultDescription)
                            .setColor("RANDOM")

        await interaction.editReply({
            embeds: [embed],
            content: 'Which song would you like to choose? Enter the number.'
        })

        const response = await interaction.channel.awaitMessages({
            filter: (m) => m.member.user.id === interaction.user.id,
            max: 1,
            time: ms('1m')
        })
        const answer = response.first().content
        const track = tracks[parseInt(answer) - 1]

        const player = client.MusicManager.players.get(interaction.guild.id);

        
        if (!player) {
            await interaction.editReply({
                content: `There is no current song playing!`
            })
        }

        player.queue.add(track)

        await interaction.editReply({
            content: `Enqued track ${track.title}.`,
            embeds: null,
        })
        return;
    }
}