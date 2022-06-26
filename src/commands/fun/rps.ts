import { SlashCommandBuilder } from "@discordjs/builders";
import {
    CommandInteraction,
    GuildMember,
    MessageActionRow,
    MessageButton,
} from "discord.js";
import { MessageEmbed } from "discord.js";
import { DiscordClientJS } from "../../builders/client";
import type RPS from "../../utils/types";
import { prisma } from "../../prisma";
import { User } from "@prisma/client";

export default {
    command: new SlashCommandBuilder()
        .setName("rps")
        .setDescription("Rock Paper Scissors!"),
    async run(interaction: CommandInteraction, client: DiscordClientJS) {
        const author = interaction.member as GuildMember;

        let user: User = await prisma.user.findUnique({
            where: { userId: author.user.id },
        });

        if (!user) {
            user = await prisma.user.create({
                data: { userId: author.user.id },
            });
        } else {
            user = user;
        }

        let hand: RPS[] = [
            {
                txt: "Rock",
                emoji: "✊",
                index: 0,
            },
            {
                txt: "Paper",
                emoji: "✋",
                index: 0,
            },
            {
                txt: "Scissors",
                emoji: "✌",
                index: 0,
            },
        ];

        let botMove = hand[Math.floor(Math.random() * 3)];

        const embed = new MessageEmbed()
            .setTitle(`Rock Paper Scissors`)
            .setDescription("Choose a hand sign!")
            .setImage(
                `https://static.vecteezy.com/system/resources/previews/000/691/497/non_2x/rock-paper-scissors-neon-icons-vector.jpg`
            )
            .setColor("GREEN");
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("rps_rock")
                .setLabel("Rock")
                .setEmoji("✊")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("rps_paper")
                .setLabel("Paper")
                .setEmoji("✋")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("rps_scissors")
                .setLabel("Scissors")
                .setEmoji("✌")
                .setStyle("PRIMARY")
        );
        const rpsMsg = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true,
        });

        let win = [];
        let userMove: any;

        const filter = (interaction) => !interaction.user.bot;

        const collector = interaction.channel.createMessageComponentCollector({
            filter: filter,
            componentType: "BUTTON",
            time: 10000,
        });

        collector.on("collect", async (interaction) => {
            if (!interaction.isButton()) return;

            if (interaction.customId.startsWith("rps")) {
                await interaction.deferUpdate();

                let move = interaction.customId.split("_")[1];
                userMove = hand.find((h) => h.txt.toLocaleLowerCase() === move);

                switch (move) {
                    case "rock":
                        if (botMove.txt.toLowerCase() === "scissors") {
                            win = ["You Won!", ">"];
                        } else if (
                            botMove.txt.toLocaleLowerCase() === "paper"
                        ) {
                            win = ["You Lost!", "<"];
                        } else {
                            win = ["It's a tie!", "="];
                        }
                        break;
                    case "paper":
                        if (botMove.txt.toLowerCase() === "scissors") {
                            win = ["You Lost!", "<"];
                        } else if (
                            botMove.txt.toLocaleLowerCase() === "paper"
                        ) {
                            win = ["It's a tie!", "="];
                        } else {
                            win = ["You Won!", ">"];
                        }
                        break;
                    case "scissors":
                        if (botMove.txt.toLowerCase() === "scissors") {
                            win = ["It's a tie!", "="];
                        } else if (
                            botMove.txt.toLocaleLowerCase() === "paper"
                        ) {
                            win = ["You Won!", ">"];
                        } else {
                            win = ["You Lost!", "<"];
                        }
                        break;
                }

                let embedL: any = rpsMsg.embeds[0];
                let componentsL: any = rpsMsg.components;

                embedL.color = "BLUE";
                embedL.description = `**I chose ${botMove.txt}! ${win[0]}** (${userMove.emoji} **${win[1]}** ${botMove.emoji})`;

                if (win[0] === "You Won!") {
                    await prisma.user.update({
                        where: { userId: author.user.id },
                        data: {
                            rps_wins: user.rps_wins + 1,
                        },
                    });
                } else if (win[0] === "You Lost!") {
                    await prisma.user.update({
                        where: { userId: author.user.id },
                        data: {
                            rps_losses: user.rps_losses + 1,
                        },
                    });
                } else {
                    await prisma.user.update({
                        where: { userId: author.user.id },
                        data: {
                            rps_ties: user.rps_ties + 1,
                        },
                    });
                }

                componentsL.forEach((comp) => {
                    if (comp.customId == interaction.customId) {
                        comp.disabled = true;
                        comp.style = "SECONDARY";
                    } else comp.disabled = true;
                });

                await interaction.editReply({
                    embeds: [embedL],
                    components: componentsL,
                });

                collector.stop();
            }
        });
    },
};
