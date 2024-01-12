//Discord npm
const Discord = require("discord.js")
//Booru npm
const Booru = require("booru")
//color-thief-node npm, used to get most prominent color from an image
const { getColorFromURL } = require('color-thief-node');

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("furry")
    .setDescription("Searches for a furry image in safebooru")
    //Command tag option
    .addStringOption(option => 
        option.setName("tags")
        .setDescription("Tags to search for, sepparated by spaces (Leave empty for random)")
        .setRequired(false)), //This option is not required
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()
        //Getting tags from interaction
        //Tags only start with "furry"
        var tags = "furry"
        if(interaction.options.getString("tags") != null){
            //if the user specified tags, add them to the search
            tags += " " + interaction.options.getString("tags")
        }
        //Search for posts with the tags
        Booru.search("safebooru", [tags], {limit: 1, random: true}).then(async posts => {
            if(posts.length == 0){
                //If no posts are found, reply with an error
                await interaction.editReply("No posts found with tags: " + tags.substring(6))
                return
            }
            for (let post of posts) {
                //Get the dominant color of the furry image
                const dominantColor = await getColorFromURL(post.fileUrl);
                //Create an embed with the image
                const furryEmbed = new Discord.EmbedBuilder()
                .setTitle("Furry Image")
                .setURL(post.postView)
                .setImage(post.fileUrl)
                .setColor(dominantColor)
                .setTimestamp()
                //Reply with the embed
                await interaction.editReply({embeds: [furryEmbed]})
            }
        }).catch(err => {
            //If an error occurs, reply with the error message
            console.log(err.message)
            interaction.editReply("Error: " + err.message)
        })
    }
}