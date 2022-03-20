const discord = require("discord.js")

module.exports = {
    command: "stop",
    description: "stops the bot",
    category: "Action",
    admin: true,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
    execute: async function (client, message) {
        client.destroy()
        setTimeout(() => {
            process.exit(0)
        }, 1000)
    }
}