//Discord npm
const { error } = require("console")
const Discord = require("discord.js")
//fs
const fs = require("fs")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("addnewuseralert")
    .setDescription("Add an alert when an user joins the server or modify an existing one")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageRoles)
    .setDMPermission(false)
    // Channel option
    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Channel to send the alert to")
        .setRequired(true))
    .addStringOption(option =>
        option.setName("message")
        .setDescription("Message to send when a new user joins the server, add <username> to mention the user.")
        .setRequired(false)),
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()

        // Creating an embed to send errors
        const errorEmbed = new Discord.EmbedBuilder()
            .setTitle("❌ | Error")
            .setColor("#fc0000")

        // Embed for confirmations
        const confirmEmbed = new Discord.EmbedBuilder()
            .setTitle("✅ | Success")
            .setColor(client.color)
            .setDescription("The alert has been set successfully")

        //Get collection
        const collectionName = "newUserAlerts";
        const collection = client.db.collection(collectionName);
        //Check if the server is already in the alerts system
        const alert = await collection.findOne({guild_id: interaction.guildId});
        if(alert){
            errorEmbed.setDescription("The server is already in the alerts system!");
            return await interaction.editReply({embeds:[errorEmbed], ephemeral: true });
        }
        //Check if the channel is a text channel
        var channel = interaction.options.getChannel("channel")
        if(channel.type != 0){
            errorEmbed.setDescription("That channel is not a text channel!");
            return await interaction.editReply({embeds:[errorEmbed], ephemeral: true });
        }
        //Get the channel from the interaction
        var message = interaction.options.getString("message") ? interaction.options.getString("message") : "A new user has joined the server! Welcome <username>!" ;
        const entry = {
            guild_id: interaction.guildId,
            channel_id: channel.id,
            message: message
        }
        //Add the alert to the alerts system
        await collection.insertOne(entry);
        //Save the file
        await interaction.editReply({embeds:[confirmEmbed]});    
    }
}