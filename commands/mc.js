const https = require("https")
const discord = require("discord.js")

module.exports = {
    command: "mc",
    description: "gives information about a minecraft user",
    category: "Utility",
    admin: false,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
    execute: async function(client, message) {
        message.channel.sendTyping()
        var identifier = message.content.split(" ")[2] || "Notch"
        new https.request(`https://api.ashcon.app/mojang/v2/user/${identifier}`, (res) => {
            var json = ""

            res.on("data", (chunk) => {
                json += chunk.toString()
            })

            res.on("end", () => {
                var object = JSON.parse(json)
                var nameHistory = ""
                object["username_history"].forEach((pastUsername) => {
                    var timestamp = pastUsername["changed_at"] || "Original"
                    if(timestamp != "Original") { timestamp = new Date(timestamp).toUTCString() }
                    nameHistory += `\`\`> ${pastUsername["username"]} (${timestamp})\`\`\n`
                })
                if(nameHistory.length > 1024) {
                    nameHistory = nameHistory.substring(0, 1019) + "..."
                }
                var embed = new discord.MessageEmbed()
                .setTitle("Game Profile")
                .setColor(0xDA1C3E)
                .setThumbnail(`https://crafatar.com/renders/head/${object.uuid}`)
                .addField("Username", object.username, true)
                .addField("UUID", object.uuid, true)
                .addField("Name History", nameHistory)
                .setTimestamp()
                .setFooter({iconURL: message.author.avatarURL(), text: `Requested by: ${message.author.tag}`})
                message.channel.send({embeds: [embed]})
            })
        }).end()
    }
}