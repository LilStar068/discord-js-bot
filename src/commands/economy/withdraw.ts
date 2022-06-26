import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";
import { prisma } from "../../prisma";
import { withdrawAmount } from "../../utils";

export default {
    command: new SlashCommandBuilder()
                    .setName('withdraw')
                    .setDescription('Withdraw money from your bank to your wallet.')
                    .addStringOption((option) => (
                        option
                            .setName('amount')
                            .setDescription('The amount to withdraw (number/max)')
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
            amount = bank
        } else {
            amount = parseInt(userInput)
        }

        if (amount === 0) {
            return await interaction.reply({
                content: `Your dont have any money in your bank to withdraw!`,
                ephemeral: true,
            })
        }

        if (amount > bank) {
            return await interaction.reply({
                content: `You can only withdraw a maximum amount of ${client.customEmojis.coin} ${bank}!`,
                ephemeral: true,
            })
        }

        await withdrawAmount(author, amount)

        const embed = new MessageEmbed()
                            .setTitle('Withdrew Amount!')
                            .setDescription(`Successfully withdrew ${client.customEmojis.coin} ${amount} from your bank!`)
                            .setColor("GREEN")

        await interaction.reply({
            embeds: [embed]
        })
    }
}