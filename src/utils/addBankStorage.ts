import { GuildMember } from "discord.js"
import { prisma } from "../prisma"
import { random } from "./"

const addBankStorage = async (user: GuildMember): Promise<void> => {
    const pUser = await prisma.user.findUnique({ where: { userId: user.user.id } })
    
    await prisma.user.update({
        where: { userId: user.user.id },
        data: { bankStorage: pUser.bankStorage + random(100, 200) }
    })
}

export default addBankStorage;