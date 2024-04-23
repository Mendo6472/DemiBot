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
//Twitch token Getter
const { getTwitchToken } = require("./twitchTokenGetter.js");
//Gradient  
const gradient = require("gradient-string");
//MongoDB
const { MongoClient } = require('mongodb');

//Function to handle discord client events
async function Eventexecuter(client){
    //Event when the client "turns on"
    client.on('ready', () => {
        console.log(gradient('pink','purple')(`Bot is online! Logged in as ${client.user.tag}`));
        //TODO: Add status to bot
    });
    //Get twitch tokens
    const twitchToken = await getTwitchToken();
    client.twitchToken = twitchToken;
    //Create mongoDB client
    let uri = process.env.MONGODB_URI;
    const username = encodeURIComponent(process.env.MONGODB_USERNAME);
    const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
    uri = uri.replace("<username>", username).replace("<password>", password);
    const clientMongo = new MongoClient(uri);
    //Connect to the client
    await clientMongo.connect();
    client.mongo = clientMongo;
    client.db = clientMongo.db("DemiBot");

    //Event to execute when the discord client receives a message
    client.on('messageCreate', (message) => {
        if(message.author.bot) return;
        if(message.channel.type === "dm") return;
        handleAFK(message, client);
        handleRank(message, client);      
    });
    //Event to execute when a slash command is used
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand) return;
        const slashComs = client.slashcommands.get(interaction.commandName);
        if (!slashComs) return;
        try {
            await slashComs.run(client, interaction);
        } catch (e) {
            console.log("Error running slash command: ", interaction.commandName);
            console.log(e);
        }
    });
    //Event to execute when the discord client faces an error
    client.on('error',(error) =>{
        console.log(error);
    });
}
//Exporting the Eventexecuter funtion
module.exports = {
    Eventexecuter,
}