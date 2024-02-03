//Discord npm
const Discord = require('discord.js');
//axios npm
const axios = require('axios');

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("blush")
    .setDescription("Blush!")
    .setDMPermission(false),
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()
        var responseString = `<@${interaction.user.id}> is blushing!`;
        //Get the cry gif
        axios.get("https://api.waifu.pics/sfw/blush")
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