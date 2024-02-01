//Discord npm
const Discord = require("discord.js")
//fs
const fs = require("fs")
//natural
var natural = require('natural');

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("info")
    .setDescription("This command gives you information about a command in specific")
    .setDMPermission(false)
    .addStringOption(option =>
        option.setName("command")
        .setDescription("Command to get information from")
        .setRequired(true)),
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()
        //Get the command from the interaction
        var command = interaction.options.getString("command")
        //Get the commands folder
        var commandsFolder = fs.readdirSync("./slashcommands")
        //Check if the command is in the folder
        var commandSearchResult = commandSearch(commandsFolder, command)
        if(commandSearchResult.length == 0){
            //If not, reply with an error
            await interaction.editReply({content: "This command doesn't exist"})
            return
        }
        //Get the command file
        var commandFile = require("./" + commandSearchResult[0])
        //Create an embed with the command information
        const commandEmbed = new Discord.EmbedBuilder()
            .setTitle("Command information")
            .setDescription("Information about the command: " + commandFile.data.name)
            .setColor(client.color)
            .setAuthor({name: client.user.username, iconURL: client.user.avatarURL({dynamic: true}), url: client.github})
            .addFields(
                {
                    name: "Name",
                    value: commandFile.data.name,
                    inline: true
                },
                {
                    name: "Description",
                    value: commandFile.data.description,
                    inline: true
                }
            )
            //If the command needs certain special permissions, add those permissions to the embed
            permissions = commandFile.data.default_member_permissions
            if(permissions != undefined){
                commandEmbed.addFields({name: "Need special permisions to run command?", value: "Yes"})
            }
            //If the command has options, add them to the embed
            if(commandFile.data.options.length == 0){
                commandEmbed.addFields({name: "Options", value: "None"})
            } else {
                commandEmbed.addFields({name: "Options", value: " "})
            }
            for(let option of commandFile.data.options){
                commandEmbed.addFields({name: option.name, value: option.description + "\nRequired: " + option.required})
            }
        //Reply with the embed
        await interaction.editReply({embeds: [commandEmbed]})
    }
}

function commandSearch(commandsFolder, searchQuery, threshold = 0.85) {
    var commands = [];   
    for(const folder in commandsFolder){
        fs.readdirSync("./slashcommands/" + commandsFolder[folder]).forEach((file) => {
            commands.push(file)
        })
    }
    const searchResults = commands.filter((item) => {
        let commandName = item.slice(0, -3);
        const similarity = natural.JaroWinklerDistance(commandName, searchQuery.toLowerCase(), {ignoreCase: true});
        return similarity >= threshold;
    });
    if (searchResults && Array.isArray(searchResults)) {
        searchResults.sort((a, b) => {
            const similarityA = natural.JaroWinklerDistance(a.slice(0, -3), searchQuery, {ignoreCase: true});
            const similarityB = natural.JaroWinklerDistance(b.slice(0, -3), searchQuery, {ignoreCase: true});
            return similarityB - similarityA;
        });
    }
    return searchResults;
}