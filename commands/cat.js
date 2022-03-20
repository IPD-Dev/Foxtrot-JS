const discord = require("discord.js")
const https = require("https")
const facts = require("../facts/cats.json")

module.exports = {
    command: "cat",
    description: "cattttttttt",
    category: "Animals",
    admin: false,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
     execute: async function(client, message) {
        await message.delete()

        new https.request(`https://api.thecatapi.com/v1/images/search`, (res) => {
            var json = ""

            res.on("data", (chunk) => {
                json += chunk.toString()
            })

            res.on("end", () => {
                var object = JSON.parse(json)[0]
                var url = object.url
                var embed = new discord.MessageEmbed()
                .setTitle("Cat")
                .setDescription(facts[Math.floor(Math.random() * facts.length)])
                .setImage(url)
                .setColor(0xf3ddc6)
                .setFooter({iconURL: message.author.avatarURL(), text: `Requested by: ${message.author.tag}`})
                .setTimestamp()
                message.channel.send({embeds: [embed]})
            })

            res.on("error", () => {
                message.channel.send(`Received unexpected error, unclear instructions, got stuck in toaster!`)
            })
        }).end()
    }
}