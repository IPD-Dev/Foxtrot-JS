const discord = require("discord.js")
const crypto = require("crypto")

module.exports = {
    command: "meme",
    description: "random meme",
    category: "Utility",
    admin: false,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
    execute: async function (client, message) {
        await message.channel.send(`*Command executed by ${message.author.tag}*`)
        await message.delete()
        
        var id = crypto.randomUUID()
        var urls = [/*`https://shitfest.net/random&id=${id}`*/`https://timeout.zone/api/random?redirect=1&id=${id}`, `https://p90.zone/?${id}`]
        message.channel.send(urls[Math.floor(Math.random() * urls.length)])
    }
}