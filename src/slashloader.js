//Discord npm
const Discord = require("discord.js")
//File loading
const fs = require("fs")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")
const commands = []
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
        console.log("Comando '" + slash.data.name + "' cargado...")
    }
    require('dotenv').config();
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN); //Token del bot
    createSlash()
    async function createSlash(){
        try{
            await rest.put(
                Routes.applicationCommands("1195181006718771312"),{
                    body: commands
                }
            )
            console.log("Comandos Slash Cargados...")
        }catch(e){
        console.error(e)
        }
    }
    //---------------------------uwu----------------------------
}
module.exports = {
Loader,
};