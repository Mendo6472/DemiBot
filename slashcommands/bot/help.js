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
        //Build embed
        const helpEmbed = new Discord.EmbedBuilder()
            .setTitle("Help")
            .setDescription("List of commands")
            .setColor(client.color)
            .setAuthor({name: client.user.username, iconURL: client.user.avatarURL({dynamic: true}), url: client.github})
            .setTimestamp()

        //Loading all commands from the /slashcommands
        fs.readdirSync("./slashcommands/").forEach((folder) => {
            //Add a field for each folder
            helpEmbed.addFields({name: `『**${folder}**』`, value: " "})
            const slashCommands = fs
            .readdirSync(`./slashcommands/${folder}/`)
            .filter((file) => file.endsWith(".js"));

            var categoryCommands = "";

            for (const file of slashCommands) {
                //Get the command
                const slash = require(`../${folder}/${file}`)
                //Add the name of the command to the string
                categoryCommands += `${slash.data.name}, `
                //helpEmbed.addFields({name: slash.data.name, value: slash.data.description, inline: true})
            }
            //Delete the last comma
            categoryCommands = categoryCommands.slice(0, -2)
            //Add the string to the field
            helpEmbed.data.fields.find(field => field.name === `『**${folder}**』`).value = categoryCommands
        })
        //Send embed
        await interaction.editReply({embeds: [helpEmbed]})
    }
}