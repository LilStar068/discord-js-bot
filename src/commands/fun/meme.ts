import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction, GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";
import axios from "axios";
import { DiscordClientJS } from "../../builders/client";

export default {
    command: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Post Meme in the chat!")
        .addStringOption((option) => (
            option
                .setName('category')
                .setChoices({
                    name: 'Dank Memes',
                    value: 'dankmemes'
                }, 
                {
                    name: 'Me IRL',
                    value: 'me_irl'
                })
                .setDescription('Options')
                .setRequired(false)
        )),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const category = interaction.options.getString('category') ? ('/gimme/' + interaction.options.getString('category')) : '/gimme/memes'

        const response = await axios.get(
            `https://meme-api.herokuapp.com${category}`
        );
        const author = interaction.member as GuildMember;

        const emb = new MessageEmbed()
            .setTitle(`${response.data.title} | By: ${response.data.author}`)
            .setImage(`${response.data.url}`)
            .setURL(`${response.data.postLink}`)
            .setFooter({
                text: `Requested by: ${author.user.tag}`,
                iconURL: author.user.displayAvatarURL(),
            })
            .setColor("RANDOM");
        await interaction.reply({ embeds: [emb] });
    },
};
