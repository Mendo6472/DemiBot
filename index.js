//Discord npm
const Discord = require('discord.js');
//Files from src folder, used to load slash commands, handle client events and twitch api
const { Loader } = require("./src/slashloader.js");
const { Eventexecuter } = require("./src/eventexecuter.js")
const { checkStreamersStatus } = require("./src/streamChecker.js")
//Creating bot client with the bot login intents
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
    ],
    partials: [Discord.Partials.Channel],
})
//Saving variables to the client
client.color = "#761180";
client.github = "https://github.com/Mendo6472/DemiBot"
//----------File loading----------
//Executing /src/slashloader.js
Loader(client);
//----------Client Events----------
//Executing /src/eventexecuter.js
Eventexecuter(client);
//----------Twitch API----------
//Executing /src/streamChecker.js
setInterval(() => checkStreamersStatus(client), 60 * 1000);

//Bot login, token on .env file
require('dotenv').config();
client.login(process.env.DISCORD_BOT_TOKEN);