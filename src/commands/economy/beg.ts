import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";
import { prisma } from "../../prisma";
import { addBalance, addBankStorage, random } from "../../utils";

export default {
    command: new SlashCommandBuilder()
                        .setName('beg')
                        .setDescription('Beg for some money ;-;.'),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const author = interaction.member as GuildMember
        const prismaUser = await prisma.user.findUnique({ where: { userId: author.user.id }})

        const randomNumber = random(1, 8)

        if (randomNumber !== random(1, 8)) {
            const randomMoney = random(150, 250)

            const embed = new MessageEmbed()
                                .setTitle(`Here ya go kid`)
                                .setDescription(`A random guy just gave you ${client.customEmojis.coin} ${randomMoney}`)
                                .setColor("GREEN")

            await addBankStorage(author);
            await addBalance(author, randomMoney);

            await interaction.reply({
                embeds: [embed]
            })
        } else {
            const embed = new MessageEmbed()
                                .setTitle("Sed Laife")
                                .setDescription("You begged for hours but no one game you money...")
                                .setColor("GREY")

            await interaction.reply({
                embeds: [embed]
            })
        }
    }
}