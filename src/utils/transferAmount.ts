import { GuildMember } from "discord.js"
import { prisma } from "../prisma"

const addBalance = async (from: GuildMember, to: GuildMember, amount: number): Promise<void> => {
    const fromUser = await prisma.user.findUnique({ where: { userId: from.user.id } })
    const toUser = await prisma.user.findUnique({ where: { userId: to.user.id } })
    
    await prisma.user.update({
        where: { userId: from.user.id },
        data: { wallet: fromUser.wallet - amount }
    })
    
    await prisma.user.update({
        where: { userId: to.user.id },
        data: { wallet: toUser.wallet + amount }
    })
}

export default addBalance;