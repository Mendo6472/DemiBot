//Discord npm
const Discord = require('discord.js');
//axios npm
const axios = require('axios');

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("kiss")
    .setDescription("Kiss someone!")
    .setDMPermission(false)
    //Command user option
    .addUserOption(option =>
        option
        .setName('user')
        .setDescription('User to kiss')
        .setRequired(true)),
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()
        //Target will be the user inputed into the "user" option on the interaction
        var target = interaction.options.getUser('user');
        var responseString = "";
        //If they choosed themselves, make the message different
        if(target.id == interaction.user.id){
            responseString = `<@${interaction.user.id}> kissed themselves!`;
        }
        //If they choosed the bot, make the message different
        if(target.id == client.user.id){
            responseString = `<@${interaction.user.id}> kissed me!`;
        }
        //If they choosed someone else
        if(responseString == ""){
            responseString = `<@${interaction.user.id}> kissed <@${target.id}>`;
        }
        //Get the kiss gif
        axios.get("https://api.waifu.pics/sfw/kiss")
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