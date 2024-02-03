//Discord npm
const Discord = require('discord.js');
//axios npm
const axios = require('axios');

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("wink")
    .setDescription("Wink at someone!")
    .setDMPermission(false)
    //Command user option
    .addUserOption(option =>
        option
        .setName('user')
        .setDescription('User to wink at')
        .setRequired(false)),
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()
        //Target will be the user inputed into the "user" option on the interaction
        //If no user is inputed, the target will be the user who used the command
        var target = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
        var responseString = "";
        //If they choosed themselves/No one, make the message different
        if(target.id == interaction.user.id){
            responseString = `<@${interaction.user.id}> is winking!`;
        }
        //If they choosed the bot, make the message different
        if(target.id == client.user.id){
            responseString = `<@${interaction.user.id}> is winking at me!`;
        }
        //If they choosed someone else
        if(responseString == ""){
            responseString = `<@${interaction.user.id}> is winking at <@${target.id}>`;
        }
        //Get the hug gif
        axios.get("https://api.waifu.pics/sfw/wink")
        .then(function (response) {
            //Create the embed
            const embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setDescription(responseString)
            .setImage(response.data.url)
            //Reply with the embed
            interaction.editReply({embeds: [embed]});
        })
    }
}