import { GuildMember } from "discord.js"
import { prisma } from "../prisma"

const withdrawAmount = async (user: GuildMember, amount: number): Promise<void> => {
    const pUser = await prisma.user.findUnique({ where: { userId: user.user.id } })
    
    await prisma.user.update({
        where: { userId: user.user.id },
        data: { wallet: pUser.wallet + amount, bank: pUser.bank - amount }
    })
}

export default withdrawAmount;