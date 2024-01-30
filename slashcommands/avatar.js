//Discord npm
const Discord = require("discord.js")
//color-thief-node npm, used to get most prominent color from an image
const { getColorFromURL } = require('color-thief-node');

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("avatar")
    .setDescription("Get your avatar or someone else's")
    .setDMPermission(false)
    //Command user option
    .addUserOption(option =>
        option
        .setName('user')
        .setDescription('User to get the avatar from (Leave empty for your own avatar)')
        .setRequired(false)),
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()
        //Target will be the user inputed into the "user" option on the interaction
        //If they didn't choose any user, the target will be the same user who used the interaction
        var target = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
        //Avatar to display in embed
        const avatar = target.displayAvatarURL({size: 2048});
        try {
            //Dominant color on the target avatar
            const dominantColor = await getColorFromURL(target.displayAvatarURL({size: 1024, extension: "png"}));
            //Creating the embed
            const avatarEmbed = new Discord.EmbedBuilder()
            .setColor(dominantColor)//Color is the dominant color on the target avatar
            .setTitle(target.username)
            .setImage(avatar)
            .setTimestamp();
            await interaction.editReply({embeds: [avatarEmbed]}) 
        } catch (error) {
            console.error(error)   
        }

	}
}