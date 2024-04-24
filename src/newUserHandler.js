//Discord
const Discord = require("discord.js");

async function handleNewUser(client, member) {
    //Get the alert from the db
    const collectionName = "newUserAlerts";
    const collection = client.db.collection(collectionName);
    const guildId = member.guild.id;
    const alert = await collection.findOne({ guild_id: guildId });
    //If there is no alert for the server, return
    if (!alert) return;
    const guild = member.guild;
    const channelId = alert.channel_id;
    const channel = guild.channels.cache.get(channelId);
    //If the channel doesn't exist, return
    if (!channel) return;
    var message = alert.message;
    //Replace the <username> tag with the user mention
    message = message.replace("<username>", "<@" + member.user.id + ">");

    const embed = new Discord.EmbedBuilder()
        .setTitle("Welcome to the server!")
        .setDescription(message)
        .setThumbnail(member.user.avatarURL())
        .setColor(client.color)
        .setTimestamp()
        .setFooter({ text: guild.name, iconURL: guild.iconURL()})
    channel.send({ embeds: [embed] });
}
module.exports = {
    handleNewUser,
}