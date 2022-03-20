const discord = require("discord.js")
const config = require("./config.json")
const path = require("path")
const fs = require("fs")
var client = new discord.Client({intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.GUILD_MEMBERS]})

var commandCache = null
client.categories = null
var commandsFolder = path.join(__dirname, "commands")

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

function calculateCommandsAndCategories() {
    commandCache = new Map()
    client.categories = new Map()
    fs.readdirSync(commandsFolder, {encoding: "utf-8"}).forEach((file) => {
        var module = requireUncached(path.join(commandsFolder, file))
    
        if(client.categories.has(module.category)) {
            var cats = client.categories.get(module.category)
            cats.push(module)
            client.categories.set(module.category, cats)
        } else {
            client.categories.set(module.category, [module])
        }
        
        commandCache.set(module.command, module)
    })
} 

calculateCommandsAndCategories()

fs.watch(commandsFolder, (type) => {
    calculateCommandsAndCategories()
})

/**
 * Execute command for message
 * @param {discord.Message} message 
 * @returns Promise
 */
function executeCommandFor(message) {
    return new Promise((resolve, reject) => {
        var command = message.content.split(config.prefix)[1].split(" ")[0]
        console.log(command)
        if(commandCache.has(command)) {
            var cmd = commandCache.get(command)
            if(cmd.admin) {
                if(config.developers.includes(message.author.id)) {
                    commandCache.get(command).execute(client, message)
                } else {
                    reject()
                }
            } else {
                commandCache.get(command).execute(client, message)
            }
            resolve()
        } else {
            reject()
        }
    })
}

client.on("messageCreate", async (message) => {
    if(message.content.startsWith(config.prefix)) {
        message.channel.sendTyping()
        executeCommandFor(message).catch(() => {
            message.reply(`Command was not found!`)
        })
    }
})

function updatePresence() {
    var used = process.memoryUsage().heapUsed / 1024 / 1024;
    client.user.setPresence({status: "online", activities: [{name: `${client.guilds.cache.size} guilds with ${Math.floor(used * 100) / 100} MB of RAM`, type: "WATCHING"}]})
}

setInterval(() => {
    updatePresence()
}, 5000)

client.on("ready", () => {
    console.log(`Ready as ${client.user.tag}!`)
    updatePresence()
})

client.on("guildCreate", updatePresence)

process.on("uncaughtException", (exception) => {
    console.warn(exception)
    return;
    console.error(exception)
    var last = "dnd"
    for(i = 0; i < 10; i++) {
        setTimeout(() => {
            last = (last == "dnd") ? "idle": "dnd"
            client.user.setPresence({status: last, activities: [{name: "Critical error!"}]})
        }, 1000 * i)
    }
    setTimeout(() => {
        client.user.setPresence({status: "invisible"})
        client.destroy()
        setTimeout(() => {
            process.exit(-1)
        }, 1000)
    }, 11 * 1000)
})

client.login(config.token)