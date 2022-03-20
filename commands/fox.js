const https = require("https")
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")
const discord = require("discord.js")

module.exports = {
    command: "fox",
    description: "gives you a fluffy fox",
    category: "Animals",
    admin: false,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
    execute: async function(client, message) {
        await message.delete()

        new https.request(`https://some-random-api.ml/animal/fox`, (res) => {
            var json = ""

            res.on("data", (chunk) => {
                json += chunk.toString()
            })

            res.on("end", () => {
                var object = JSON.parse(json)
                var fact = object.fact
                var url = object.image
                var embed = new discord.MessageEmbed()
                .setTitle("Fox")
                .setDescription(fact)
                .setImage(url)
                .setColor(0xce7125)
                .setFooter({iconURL: message.author.avatarURL(), text: `Requested by: ${message.author.tag}`})
                .setTimestamp()
                message.channel.send({embeds: [embed]})
            })

            res.on("error", () => {
                message.channel.send(`Received unexpected error, foxes occupied by ginlang, who is currently hugging them! 413 Payload too Large`)
            })
        }).end()
    }
}