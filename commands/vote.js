const discord = require("discord.js")

module.exports = {
    command: "vote",
    description: "gives the top.gg vote link",
    category: "Meta",
    admin: false,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
    execute: async function (client, message) {
        await message.delete()
        message.author.send(`Vote for Foxtrot on top.gg! <https://top.gg/bot/909103805264724038/vote>`).catch(() => {
            message.channel.send(`${message.author}, you must unblock me or enable messages!`)
        })
    }
}