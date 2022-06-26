import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Guild, GuildMember, MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";
import { prisma } from "../../prisma";
import { transferAmount, random } from "../../utils";

export default {
    command: new SlashCommandBuilder()
                    .setName('rob')
                    .setDescription('Try to rob a user.')
                    .addUserOption((option) => (
                        option
                            .setName('user')
                            .setDescription('The user to rob')
                            .setRequired(true)
                    )),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const author = interaction.member as GuildMember;
        const culprit = interaction.options.getMember('user') as GuildMember
        const cpUser = await prisma.user.findUnique({ where: { userId: culprit.user.id } })
        const amount = random(1, cpUser.wallet / 2)

        const chance = random(1, 5)
        if (chance !== random(1, 5)) {

            await transferAmount(culprit, author, amount)

            const embed = new MessageEmbed()
                                .setTitle('Robbed Successfully!')
                                .setDescription(`Your robbed ${client.customEmojis.coin} ${amount} from <@${cpUser.userId}>`)
                                .setColor("GREEN")

            const userEmbed = new MessageEmbed()
                                .setTitle('Robbed!')
                                .setDescription(`<@${author.user.id}> robbed ${client.customEmojis.coin} ${amount} from you!`)
                                .setColor("RED")

            await interaction.reply({
                embeds: [embed],
            })

            try {
                await culprit.send({
                    embeds: [userEmbed]
                })
            } catch (_error) {
                return;
            }
        } else {
            await transferAmount(author, culprit, (amount / 3) * 2)

            const embed = new MessageEmbed()
                                .setTitle('Robbery Failed!')
                                .setDescription(`Your tried to rob <@${cpUser.userId}> but failed. You paid them ${client.customEmojis.coin} ${amount}.`)
                                .setColor("RED")

            const userEmbed = new MessageEmbed()
                                .setTitle('Not Robbed!')
                                .setDescription(`<@${author.user.id}> tried to rob you but failed. They paid you ${client.customEmojis.coin} ${amount}.`)
                                .setColor("GREEN")

            await interaction.reply({
                embeds: [embed],
            })

            try {
                await culprit.send({
                    embeds: [userEmbed]
                })
            } catch (_error) {
                return;
            }
        }
    }
}
