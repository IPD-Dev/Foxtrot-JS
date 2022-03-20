const https = require("https")
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")
const discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    command: "blurple",
    description: "similar to esmBot blurple, but with 104% more fox",
    category: "Filters",
    admin: false,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
    execute: async function(client, message) {
        var url = message.content.split(" ")[2]
        await message.delete()
        if(!message.content.split(" ")[2] || message.mentions.users.size > 0) {
            if(message.mentions.users.size > 0) {
                url = message.mentions.users.first().avatarURL({format: "png", size: 4096})
            } else {
                url = message.author.avatarURL({format: "png", size: 4096})
            }    
        }

        new https.request(`https://some-random-api.ml/canvas/blurple?avatar=${url}`, (res) => {
            var blurpleDir = path.join(__dirname, "..", "imgs", "blurple")
            const id = crypto.randomUUID()
            var filename = path.join(blurpleDir, `${id}.png`)
            if(!fs.existsSync(blurpleDir)) {
                fs.mkdirSync(blurpleDir, {recursive: true})
            }

            var writeStream = new fs.createWriteStream(filename)
            res.pipe(writeStream)

            res.on("end", async () => {
                var attachment = new discord.MessageAttachment(filename)
                var embed = new discord.MessageEmbed()
                .setTitle("Blurple")
                .setColor(0x5539cc)
                .setFooter({iconURL: message.author.avatarURL(), text: `Requested by: ${message.author.tag}`})
                .setTimestamp()
                .setImage(`attachment://${id}.png`)
                await message.channel.send({embeds: [embed], files: [attachment]})
                fs.unlinkSync(filename)
            })

            res.on("error", async () => {
                await message.channel.send({content: `An unexpected error happened, Steve.. I told you this already!`})
                fs.unlinkSync(filename)
            })
        })
        .end()
    }
}