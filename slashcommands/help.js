//Discord npm
const Discord = require("discord.js")
//fs
const fs = require("fs")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("help")
    .setDescription("This command gives you an embed with all the commands")
    .setDMPermission(false),
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()
        //Get the command from the interaction
        var command = interaction.options.getString("command")
        //Get the commands folder
        var commandsFolder = fs.readdirSync("./slashcommands")
        //Build embed
        const helpEmbed = new Discord.EmbedBuilder()
            .setTitle("Help")
            .setDescription("List of commands")
            .setColor("#761180")
            .setTimestamp()
        //Add commands to embed
        for(let file of commandsFolder){
            //Get the command file
            var commandFile = require("./" + file)
            //Add the command to the embed
            helpEmbed.addFields({name: commandFile.data.name, value: commandFile.data.description, inline: true})
        }
        //Send embed
        await interaction.editReply({embeds: [helpEmbed]})
    }
}