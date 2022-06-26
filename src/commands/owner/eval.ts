import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DiscordClientJS } from "../../builders/client";
import { inspect } from "util";
import { isValidUrl } from "../../utils";

export default {
    command: new SlashCommandBuilder()
                    .setName('eval')
                    .setDescription('Evaluate any javascript code.')
                    .addStringOption((option) => (
                        option
                            .setName('code')
                            .setDescription('The JS code to be ran.')
                            .setRequired(true)
                    )),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        if (!(interaction.user.id === '696650928907878440')) {
            return await interaction.reply({
                content: `This is an owner only command so you cannot run it.`,
                ephemeral: true,
            })
        }
  
        const code = interaction.options.getString('code')

        const isAsync = code.includes("--async");
        const isSilent = code.includes("--silent");

        try {
            let result = eval(isAsync ? `(async()=>{${code.replace('--async', '')}})()` : code);
            let isResultPromise = false;
            if (result instanceof Promise) {
                result = await result;
                isResultPromise = true;
            }
            if (isSilent) return;
            let inspectedResult = inspect(result, { depth: 0 });
            if (isResultPromise) inspectedResult = `Promise<${inspectedResult}>`;
            await interaction.reply({
                content: `${isValidUrl(inspectedResult) ? inspectedResult : `\`\`\`js\n${inspectedResult}\`\`\``}`
            });
        } catch (e) {
            await interaction.reply({ content: `\`\`\`js\n${e}\`\`\`` });
        }
    }
};