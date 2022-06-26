import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";
import { prisma } from "../../prisma";
import { depositAmount } from "../../utils";

export default {
    command: new SlashCommandBuilder()
                    .setName('deposit')
                    .setDescription('Deposit money into your bank for safe keeping.')
                    .addStringOption((option) => (
                        option
                            .setName('amount')
                            .setDescription('The amount to deposit (number/max)')
                            .setRequired(true)
                    )),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const userInput = interaction.options.getString('amount')
        const author = interaction.member as GuildMember
        const prismaUser = await prisma.user.findUnique({ where: { userId: author.user.id } })
        const bankStorage = prismaUser.bankStorage
        const bank = prismaUser.bank

        let amount: number;
        if (userInput === 'max' || userInput === 'all') {
            amount = bankStorage - bank
        } else {
            amount = parseInt(userInput)
        }

        if (amount === 0) {
            return await interaction.reply({
                content: `Your bank is alredy full!`,
                ephemeral: true,
            })
        }

        if (amount > prismaUser.wallet || amount > bankStorage - bank) {
            return await interaction.reply({
                content: `You can only deposit a maximum amount of ${client.customEmojis.coin} ${bankStorage - bank}!`,
                ephemeral: true,
            })
        }

        await depositAmount(author, amount)

        const embed = new MessageEmbed()
                            .setTitle('Deposited Amount!')
                            .setDescription(`Successfully deposited ${client.customEmojis.coin} ${amount} to your bank!`)
                            .setColor("GREEN")

        await interaction.reply({
            embeds: [embed]
        })
    }
}