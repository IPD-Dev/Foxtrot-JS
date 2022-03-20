const https = require("https")
const discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    command: "discord",
    description: "gives information about a discord user",
    category: "Utility",
    admin: false,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
    execute: async function(client, message) {
        await message.delete()
        var id = message.content.split(" ")[2] /*|| message.mentions.users.first().id*/ || message.author.id
        if(message.mentions.users.size > 0) {
            id = message.mentions.users.first().id
            console.log(id)
        }
        new https.request(`https://discord.com/api/users/${id}`, {headers: {"authorization": `Bot ${config.token}`}}, (res) => {
            var json = ""

            res.on("data", (chunk) => {
                json += chunk.toString()
            })

            res.on("end", () => {

                const DISCORD_EPOCH = 1420070400000

                // Converts a snowflake ID string into a JS Date object using the provided epoch (in ms), or Discord's epoch if not provided
                function convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH) {
                    // Convert snowflake to BigInt to extract timestamp bits
                    // https://discord.com/developers/docs/reference#snowflakes
                    const milliseconds = BigInt(snowflake) >> 22n
                    return new Date(Number(milliseconds) + epoch)
                }
                var object = JSON.parse(json)
                console.log(object)
                var embed = new discord.MessageEmbed()
                .setTitle("Discord User")
                .setColor(0x5539cc)
                .setThumbnail(`https://cdn.discordapp.com/avatars/${object.id}/${object.avatar}.png?size=4096`)
                .addField("Tag", `${object.username}#${object.discriminator}`, true)
                .addField("ID", object.id, true)
                .addField("Created", convertSnowflakeToDate(object.id).toUTCString())
                .setTimestamp()
                .setFooter({iconURL: message.author.avatarURL(), text: `Requested by: ${message.author.tag}`})
                message.channel.send({embeds: [embed]})
            })
        }).end()
    }
}