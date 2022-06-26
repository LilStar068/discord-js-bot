import { GuildMember } from "discord.js"

const parseMessage = (message: string, member: GuildMember) => {
    return message
            .replace('|user|', `<@${member.user.id}>`)
            .replace('|user_name|', `**${member.user.username}**`)
            .replace('|user_tag|', `**${member.user.tag}**`)
            .replace('|guild_name|', `**${member.guild.name}**`)
            .replace('|guild|', `**${member.guild.name}**`)
}

export default parseMessage;