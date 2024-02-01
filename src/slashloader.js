//Discord npm
const Discord = require("discord.js")
//File loading
const fs = require("fs")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")
const commands = []
//Ascii table and gradient
const ascii = require("ascii-table")
const gradient = require("gradient-string")

let table = new ascii("Slash Commands")
table.setHeading("Command", "Load Status")

function Loader(client){
    //----------File loading----------
    //Loading all commands from the /slashcommands
    client.slashcommands = new Discord.Collection();
    const slashComandos = fs
        .readdirSync("./slashcommands")
        .filter((file) => file.endsWith(".js"));
    for (const file of slashComandos) {
        const slash = require(`../slashcommands/${file}`);
        client.slashcommands.set(slash.data.name, slash);
    }
    //----------File loading----------
    //----------UPLOADING SLASH COMMANDS TO DISCORD API----------
    for (const file of slashComandos){
        const slash = require(`../slashcommands/${file}`)
        commands.push(slash.data.toJSON())
        table.addRow(slash.data.name, "Loaded")
    }
    require('dotenv').config();
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN); //Token del bot
    createSlash()
    async function createSlash(){
        try{
            await rest.put(
                Routes.applicationCommands("1195181006718771312"),{
                    body: commands
                }
            )
            console.log(gradient.rainbow(table.toString()))
        }catch(e){
            console.log(gradient('orange', 'red')('Error when loading slash commands!'))
            console.error(e)
        }
    }
    //---------------------------uwu----------------------------
}
module.exports = {
Loader,
};