import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
require("dotenv").config();

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN!);

export const registerCommands = async (
    commands: any[],
    global: boolean
): Promise<void> => {
    try {
        if (global) {
            await rest.put(Routes.applicationCommands(process.env.clientId), {
                body: commands,
            })
        } else {
            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.clientId,
                    process.env.devGuildId
                ),
                {
                    body: commands,
                }
            );
        }
    } catch (error) {
        console.error(error.message);
    }
};
