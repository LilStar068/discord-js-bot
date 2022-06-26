import { Client, Collection, Intents, TextChannel } from "discord.js";
import { Manager } from "erela.js";

export class DiscordClientJS extends Client {
    public commands = new Collection();
    public events = new Collection();
    public readonly startTimeMS = new Date().getTime();
    public readonly customEmojis = {
        "tick": "<:tick:989181380682461195>",
        "cross": "<:cross:989181358880477245>",
        "coin": "<:coin:990305701014405150>"
    }
    MusicManager: Manager;

    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGES,
            ],
        });
    }
}
