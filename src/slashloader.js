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
table.setHeading("Command", "Type", "Load Status")

function Loader(client){
    //----------File loading----------
    //Loading all commands from the /slashcommands
    client.slashcommands = new Discord.Collection();

    fs.readdirSync("./slashcommands/").forEach((folder) => {
        const slashCommands = fs
        .readdirSync(`./slashcommands/${folder}/`)
        .filter((file) => file.endsWith(".js"));

        for (const file of slashCommands) {
            const slash = require(`../slashcommands/${folder}/${file}`);
            client.slashcommands.set(slash.data.name, slash);
        }

        for (const file of slashCommands){
            const slash = require(`../slashcommands/${folder}/${file}`)
            commands.push(slash.data.toJSON())
            table.addRow(slash.data.name, folder, "Loaded")
        }
    })

    //----------File loading----------
    //----------UPLOADING SLASH COMMANDS TO DISCORD API----------
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