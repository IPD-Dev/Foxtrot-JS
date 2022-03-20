const https = require("https")
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")
const discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    command: "transborder",
    description: "makes things trans... but border?!?!",
    category: "Borders",
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

        new https.request(`https://some-random-api.ml/canvas/transgender?avatar=${url}`, (res) => {
            var transgenderDir = path.join(__dirname, "..", "imgs", "transgender")
            const id = crypto.randomUUID()
            var filename = path.join(transgenderDir, `${id}.png`)
            if(!fs.existsSync(transgenderDir)) {
                fs.mkdirSync(transgenderDir, {recursive: true})
            }

            var writeStream = new fs.createWriteStream(filename)
            res.pipe(writeStream)

            res.on("end", async () => {
                var attachment = new discord.MessageAttachment(filename)
                var embed = new discord.MessageEmbed()
                .setTitle("Transgender Border")
                .setColor(0xf1f1f1)
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