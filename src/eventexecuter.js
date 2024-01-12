//Discord npm
const Discord = require("discord.js")
//Load files
const fs = require("fs").promises;
//File watching
const chokidar = require("chokidar");
//Afk handler
const { handleAFK } = require("./afkHandler.js");
//Rank handler
const { handleRank } = require("./rankHandler.js");

//Function to handle discord client events
async function Eventexecuter(client){
    //Event when the client "turns on"
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        //TODO: Add status to bot
    });
    const afkPath = "./db/afk.json"
    const rankPath = "./db/rank.json"
    // Read the afk file asynchronously
    let afk;
    try {
        const afkFile = await fs.readFile(afkPath, 'utf-8');
        afk = JSON.parse(afkFile);
    } catch (error) {
        console.error("Error reading afk file:", error);
        afk = {};
    }

    // Read the rank file asynchronously
    let rank;
    try {
        const rankFile = await fs.readFile(rankPath, 'utf-8');
        rank = JSON.parse(rankFile);
    } catch (error) {
        console.error("Error reading rank file:", error);
        rank = {};
    }

    //Event to execute when the discord client receives a message
    client.on('messageCreate', (message) => {
        if(message.author.bot) return;
        if(message.channel.type === "dm") return;
        console.log(message.content);
        handleAFK(message, afk);
        handleRank(message, rank);      
    });
    //Event to execute when a slash command is used
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand) return;
        const slashComs = client.slashcommands.get(interaction.commandName);
        if (!slashComs) return;
        try {
            await slashComs.run(client, interaction);
        } catch (e) {
            console.log(e);
        }
    });
    //Event to execute when the discord client faces an error
    client.on('error',(error) =>{
        console.log(error);
    });
    //Event to execute when the afk file is changed
    const afkWatcher = chokidar.watch(afkPath);
    afkWatcher.on('change', async () => {
        try {
            const afkFile = await fs.readFile(afkPath, 'utf-8');
            afk = JSON.parse(afkFile);
        } catch (error) {
            console.error("Error reading afk file:", error);
        }
    });

    const rankWatcher = chokidar.watch(rankPath);
    rankWatcher.on('change', async () => {
        try {
            const rankFile = await fs.readFile(rankPath, 'utf-8');
            rank = JSON.parse(rankFile);
        } catch (error) {
            console.error("Error reading rank file:", error);
        }
    });
}
//Exporting the Eventexecuter funtion
module.exports = {
    Eventexecuter,
}