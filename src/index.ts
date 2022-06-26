import { DiscordClientJS } from "./builders/client";
import { handleRegisters } from "./handlers";
import { Manager } from 'erela.js'
import { TextChannel } from "discord.js";
require("dotenv").config();

export const client = new DiscordClientJS();

client.MusicManager = new Manager({
    nodes: [
        {
            host: 'localhost',
            port: 9000,
            password: 'susibaka',
        }
    ],
    send(id, payload) {
        const guild = client.guilds.cache.get(id)
        if (guild) guild.shard.send(payload)            
    }
})
    .on('nodeConnect', (node) => {
        console.log(`Node ${node.options.identifier} connected.`)
    })
    .on('nodeError', (node, error) => {
        console.log(`Node ${node.options.identifier} has an error: ${error.message}`)
    })
    .on('trackStart', (player, track) => {
        const channel = client.channels.cache.get(player.textChannel) as TextChannel
        channel.send(`Now playing ${track.title}`)
    })
    .on('queueEnd', (player) => {
        const channel = client.channels.cache.get(player.textChannel) as TextChannel
        channel.send(`Que has ended.`)

        player.destroy()
    })

client.once("ready", async () => {
    const statuses = [
        `${client.guilds.cache.size} Servers`,
        `${client.users.cache.size} Users`,
        `${client.channels.cache.size} Channels`,
        `/help`,
        `/invite`,
    ]

    let index = 0;
    setInterval(() => {
        if (index == statuses.length) index = 0;

        const status = statuses[index]
        client.user.setActivity(status, {
            type: 'WATCHING',
        })
        index++
    }, 5000)
    
    handleRegisters(client, __dirname, ".ts");
    console.log(`Logged in as ${client.user.tag}.`);
    client.MusicManager.init(client.user.id)
});

try {
    client.login(process.env.TOKEN);
} catch (error) {
    console.error(error.message)
}
