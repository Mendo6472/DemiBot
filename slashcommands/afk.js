//Discord npm
const Discord = require("discord.js")
//fs
const fs = require("fs")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("afk")
    .setDescription("Tell everyone you're afk and left a message")
    //Command tag option
    .addStringOption(option => 
        option.setName("message")
        .setDescription("Message to leave when someone pings you (Leave empty for no message)")
        .setRequired(false)), //This option is not required
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()
        
        var message = "";
        if(interaction.options.getString("message") != null){
            message = interaction.options.getString("message")
        }

        //Get the afk file
        var afkFile = fs.readFileSync("./db/afk.json")
        //Parse the file
        var afk = JSON.parse(afkFile)
        //Check if the user is already afk
        if(afk[interaction.user.id] != null){
            //If they are, alert them
            await interaction.editReply({ content: "You're already afk!", ephemeral: true });
            return
        }
        //Add the user to the afk list
        afk[interaction.user.id] = message
        //Save the file
        fs.writeFileSync("./db/afk.json", JSON.stringify(afk))
        //Confirm the afk
        await interaction.editReply(interaction.user.username + " is now afk");
    }
}