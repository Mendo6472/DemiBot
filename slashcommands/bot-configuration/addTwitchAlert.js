//Discord npm
const Discord = require("discord.js")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("addtwitchalert")
    .setDescription("Add a twitch stream alert to a channel")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageRoles, Discord.PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    //options
    .addStringOption(option =>
        option.setName("streamer")
        .setDescription("Username of the streamer to add the alert to")
        .setRequired(true))
    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Channel to send the alert to")
        .setRequired(true))
    .addStringOption(option => 
        option.setName("message")
        .setDescription("Addition message to show when the streamer goes live")
        .setRequired(false))
    .addRoleOption(option =>
        option.setName("role")
        .setDescription("Role to ping when the streamer goes live")
        .setRequired(false)),
    async run(client, interaction) {
        const errorEmbed = new Discord.EmbedBuilder()
            .setTitle("❌ | Error")
            .setColor("#fc0000")
        //Defering reply to avoid timeout
        await interaction.deferReply()
        //Get the streamer and the channel from the interaction
        var streamer = interaction.options.getString("streamer")
        var channel = interaction.options.getChannel("channel")
        var message = interaction.options.getString("message") ? interaction.options.getString("message") : "";
        var role = interaction.options.getRole("role") ? interaction.options.getRole("role") : null;
        //----Checks----
        //Check if the channel is a text channel
        if(channel.type != 0){
            errorEmbed.setDescription("That channel is not a text channel!");
            return await interaction.editReply({embeds:[errorEmbed], ephemeral: true });
        }
        //Check if the channel is in the server
        if(channel.guildId != interaction.guildId){
            errorEmbed.setDescription("That channel is not in this server!");
            return await interaction.editReply({embeds:[errorEmbed], ephemeral: true });
        }
        //Check if the bot is able to send messages in the channel
        //(Fuck it we ball)
        //if(!channel.permissionsFor(interaction.guild.me).has(Discord.PermissionFlagsBits.SendMessages)){
        //    errorEmbed.setDescription("I can't send messages in that channel!");
        //    return await interaction.editReply({embeds:[errorEmbed], ephemeral: true });
        //}
        //Check if the role is pingable
        //(Were roles ever not pingable?)
        //if(role && !role.mentionable){
        //    errorEmbed.setDescription("That role is not pingable!");
        //    return await interaction.editReply({embeds:[errorEmbed], ephemeral: true });
        //}
        //Get the twitch alerts collection
        const collectionName = "streamAlerts"
        const collection = client.db.collection(collectionName)
        //Check if the streamer isn't in the system
        const alert = await collection.findOne({ streamer_name: streamer })
        //Check if streamer has a message in the channel
        if(alert){
            if(alert.messages.find(message => message.channel === channel.id)){
                errorEmbed.setDescription("That streamer already has a message in that channel!");
                return await interaction.editReply({embeds:[errorEmbed], ephemeral: true });
            }
        }
        if(role){
            role = role.id;
            if(role == interaction.guildId){
                role = "everyone";
            }
        }
        
        await collection.updateOne(
            { streamer_name: streamer }, { $push: { messages: { message: message, channel: channel.id, role: role } } }, { upsert: true }
          );
        //Send success message
        const successEmbed = new Discord.EmbedBuilder()
            .setTitle("✅ | Success")
            .setColor(client.color)
            .setDescription(`Added ${streamer} to the alerts system!`)
        await interaction.editReply({embeds:[successEmbed], ephemeral: true });
    }
}