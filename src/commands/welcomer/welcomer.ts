import { SlashCommandBuilder } from "@discordjs/builders";
import { Guild as PrismaGuild } from "@prisma/client";
import { CommandInteraction, Permissions, MessageEmbed } from 'discord.js'
import { DiscordClientJS } from "../../builders/client";
import { prisma } from '../../prisma'

export default { 
    command: new SlashCommandBuilder()
                    .setName('welcomer')
                    .setDescription('Welcomer Commands')
                    .addSubcommand((command) => (
                        command
                            .setName('enable')
                            .setDescription('Enable Welcomer.')
                    ))
                    .addSubcommand((command) => (
                        command
                            .setName('disable')
                            .setDescription('Disable Welcomer.')
                    ))
                    .addSubcommand((command) => (
                        command
                            .setName('set-channel')
                            .setDescription('Set the channel where welcome messages will be sent.')
                            .addChannelOption((option) => (
                                option
                                    .setName('channel')
                                    .setDescription('The channel')
                                    .setRequired(true)
                            ))
                    ))
                    .addSubcommand((command) => (
                        command
                            .setName('set-message')
                            .setDescription('Set a custom welcome message.')
                            .addStringOption((option) => (
                                option
                                    .setName('message')
                                    .setDescription('The message')
                                    .setRequired(true)
                            ))
                    )),
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const subCommand = interaction.options.getSubcommand()
        const guild = interaction.guild
        const author = interaction.user
        let prismaGuild: PrismaGuild = await prisma.guild.findUnique({ where: { guildId: guild.id }})

        if (subCommand === 'enable') {
            const embed = new MessageEmbed()
                            .setTitle(`${client.customEmojis.tick} Enabled Wlecomer!`)
                            .setDescription(`The welcomer has been sucessfully enabled in \`${guild.name}\`!`)
                            .setColor("GREEN")
                            .setFooter({
                                text: `Enabled by: ${author.username}`,
                                iconURL: author.displayAvatarURL(),
                            })

            if (!prismaGuild) {
                prismaGuild = await prisma.guild.create({
                    data: { 
                        guildId: guild.id,
                        welcomerChannelId: guild.systemChannel.id,
                        welcomerEnabled: true,
                    }
                })

                await interaction.reply({
                    embeds: [embed]
                })
            } else {
                if (!prismaGuild.welcomerEnabled) {
                    await prisma.guild.update({
                        where: { guildId: guild.id },
                        data: { welcomerEnabled: true }
                    })

                    await interaction.reply({
                        embeds: [embed]
                    })  
                } else {
                    await interaction.reply({
                        content: `The welcomer is alredy enabled in \`${guild.name}\`!`,
                        ephemeral: true,                       
                    })
                }
            }
        } else if (subCommand === 'disable') {
            const embed = new MessageEmbed()
                            .setTitle(`${client.customEmojis.tick} Enabled Disabled!`)
                            .setDescription(`The welcomer has been sucessfully disabled in \`${guild.name}\`!`)
                            .setColor("RED")
                            .setFooter({
                                text: `Disabled by: ${author.username}`,
                                iconURL: author.displayAvatarURL(),
                            })

            if (!prismaGuild) {
                prismaGuild = await prisma.guild.create({
                    data: { 
                        guildId: guild.id,
                        welcomerChannelId: guild.systemChannel.id,
                        welcomerEnabled: false,
                    }
                })

                await interaction.reply({
                    embeds: [embed]
                })
            } else {
                if (prismaGuild.welcomerEnabled) {
                    await prisma.guild.update({
                        where: { guildId: guild.id },
                        data: { welcomerEnabled: false }
                    })

                    await interaction.reply({
                        embeds: [embed]
                    })  
                } else {
                    await interaction.reply({
                        content: `The welcomer is alredy disabled in \`${guild.name}\`!`,
                        ephemeral: true,                       
                    })
                }
            }
        } else if (subCommand === 'set-channel') {
            const channel = interaction.options.getChannel('channel')
            
            const embed = new MessageEmbed()
                                .setTitle(`${client.customEmojis.tick} Set Welcome Channel!`)
                                .setDescription(`Successfully set welcome channel to <#${channel.id}> for \`${guild.name}\``)
                                .setColor("GREEN")
                                .setFooter({
                                    text: `Actions done by: ${author.username}`,
                                    iconURL: author.displayAvatarURL(),
                                })

            if (!prismaGuild) {
                prismaGuild = await prisma.guild.create({
                    data: { 
                        guildId: guild.id,
                        welcomerChannelId: channel.id,
                        welcomerEnabled: true,
                    }
                })

                await interaction.reply({
                    embeds: [embed]
                })
            } else {
                if (!(prismaGuild.welcomerChannelId === channel.id)) {
                    if (!prismaGuild.welcomerEnabled) {
                        await interaction.reply({
                            content: `The welcomer is not enabled for \`${guild.name}\`! Enable it first using \`/welcomer enable\``,
                            ephemeral: true,
                        })
                    }

                    await prisma.guild.update({
                        where: { guildId: guild.id },
                        data: { welcomerChannelId: channel.id }
                    })

                    await interaction.reply({
                        embeds: [embed]
                    })
                } else {
                    await interaction.reply({
                        content: `Welcome Channel alredy set to <#${channel.id}>`,
                        ephemeral: true,
                    })
                }
            }
        } else if (subCommand === 'set-message') {
            const message = interaction.options.getString('message')
 
            
            const embed = new MessageEmbed()
                                .setTitle(`${client.customEmojis.tick} Set Welcome Message!`)
                                .setDescription(`Successfully set welcome message to \`${message}\` for \`${guild.name}\``)
                                .setColor("GREEN")
                                .setFooter({
                                    text: `Actions done by: ${author.username}`,
                                    iconURL: author.displayAvatarURL(),
                                })

            if (!(prismaGuild.welcomerMessage === message)) {
                if (!prismaGuild.welcomerEnabled) {
                    await interaction.reply({
                        content: `The welcomer is not enabled for \`${guild.name}\`! Enable it first using \`/welcomer enable\``,
                        ephemeral: true,
                    })
                }

                await prisma.guild.update({
                    where: { guildId: guild.id },
                    data: { welcomerMessage: message }
                })

                await interaction.reply({
                    embeds: [embed]
                })
            } else {
                await interaction.reply({
                    content: `Welcome Message alredy set to \`${message}\``,
                    ephemeral: true,
                })
            }
        }
    }
}