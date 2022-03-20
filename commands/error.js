const discord = require("discord.js")

module.exports = {
    command: "error",
    description: "force an error for testing",
    category: "Action",
    admin: true,
    /**
     * Execute the command
     * @param {discord.Client} client 
     * @param {discord.Message} message 
     */
    execute: async function (client, message) {
        console.log(fuckyou)
    }
}