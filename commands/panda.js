const discord = require("discord.js")
const https = require("https")

module.exports = {
    command: "panda",
    description: "gives you a fluffy panda",
    category: "Animals",
    admin: false,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
    execute: async function (client, message) {
        await message.delete()

        new https.request(`https://some-random-api.ml/animal/panda`, (res) => {
            var json = ""

            res.on("data", (chunk) => {
                json += chunk.toString()
            })

            res.on("end", () => {
                var object = JSON.parse(json)
                var fact = object.fact
                var url = object.image
                var embed = new discord.MessageEmbed()
                .setTitle("Panda")
                .setDescription(fact)
                .setImage(url)
                .setColor(0xffffff)
                .setFooter({iconURL: message.author.avatarURL(), text: `Requested by: ${message.author.tag}`})
                .setTimestamp()
                message.channel.send({embeds: [embed]})
            })

            res.on("error", () => {
                message.channel.send(`Received unexpected error, thats not good!`)
            })
        }).end()
    }
}