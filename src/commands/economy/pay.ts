import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";
import { prisma } from "../../prisma";
import { transferAmount, addBankStorage } from "../../utils";

export default {
    command: new SlashCommandBuilder()
                    .setName('pay')
                    .setDescription('Pay someone some money.')
                    .addUserOption((option) => (
                        option
                            .setName('user')
                            .setDescription('The user to rob')
                            .setRequired(true)
                    ))
                    .addStringOption((option) => (
                        option
                            .setName('amount')
                            .setDescription('The amount to pay (number/max)')
                            .setRequired(true)
                    )),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const author = interaction.member as GuildMember;
        const user = interaction.options.getMember('user') as GuildMember
        const userInput = interaction.options.getString('amount')
        const authorPrisma = await prisma.user.findUnique({ where: { userId: author.user.id } })
        const wallet = authorPrisma.wallet

        let amount: number;
        if (userInput === 'max' || userInput === 'all') {
            amount = wallet
        } else {
            amount = parseInt(userInput)
        }

        if (amount > wallet) {
            return await interaction.reply({
                content: `You can only give a maximum amount of ${client.customEmojis.coin} ${wallet}!`,
                ephemeral: true,
            })
        }

        await transferAmount(author, user, amount)

        const embed = new MessageEmbed()
                            .setTitle("Transfer Successfull!")
                            .setDescription(`Successfully transfered ${client.customEmojis.coin} ${amount} to <@${user.user.id}>!`)
                            .setColor("GREEN")

        const userEmbed = new MessageEmbed()
                            .setTitle("Monney added!")
                            .setDescription(`<@${author.user.id}> transfered ${client.customEmojis.coin} ${amount} to you!`)
                            .setColor("GREEN")

        await interaction.reply({
            embeds: [embed]
        })

        try {
            await user.send({
                embeds: [userEmbed]
            })
        } catch (_error) {
            return;
        }
    }
}
