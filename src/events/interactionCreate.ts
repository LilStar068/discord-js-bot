import { Interaction, Permissions } from "discord.js";
import { client } from "../";

export default {
    name: "interactionCreate",
    once: false,
    async run(interaction: Interaction) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command: any = client.commands.get(interaction.commandName);
            if (!command) return;

            try {

                if (command.default.permissions && command.default.permissions.lenght > 0) {
                    if (!((interaction.member.permissions as Permissions).has(command.default.permissions))) {
                        return await interaction.reply({
                            content: `You donot have the minnimum permissions required to run \`/${interaction.commandName}\`!`,
                            ephemeral: true,
                        })
                    }
                }

                await command.default.run(
                    interaction,
                    client
                );
            } catch (error) {
                await interaction.reply({
                    content: `An error occured while running \`/${interaction.commandName}\`!`,
                    ephemeral: true,
                });

                console.error(error);
            }
        }
    },
};
