const discord = require("discord.js")
const https = require("https")
const facts = require("../facts/dogs.json")

module.exports = {
    command: "dog",
    description: "omg dog",
    category: "Animals",
    admin: false,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
    execute: async function (client, message) {
        await message.delete()

        new https.request(`https://dog.ceo/api/breeds/image/random`, (res) => {
            var json = ""

            res.on("data", (chunk) => {
                json += chunk.toString()
            })

            res.on("end", () => {
                var object = JSON.parse(json)
                var url = object.message
                var embed = new discord.MessageEmbed()
                .setTitle("Dog")
                .setDescription(facts[Math.floor(Math.random() * facts.length)].fact)
                .setImage(url)
                .setColor(0xf6d774)
                .setFooter({iconURL: message.author.avatarURL(), text: `Requested by: ${message.author.tag}`})
                .setTimestamp()
                message.channel.send({embeds: [embed]})
            })

            res.on("error", () => {
                message.channel.send(`Received unexpected error, try our sister game, Minecraft!`)
            })
        }).end()
    }
}