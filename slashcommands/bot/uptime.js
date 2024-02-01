const Discord = require("discord.js")
const OS = require("os");
const moment = require("moment");
require("moment-duration-format")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Shows the ammount of time that the bot has been active for")
    .setDMPermission(false),
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()
        //Get the uptime of the bot
        const actividad = moment.duration(client.uptime).format(" D [Days], H [Hours], m [Minutes], s [Seconds]");
        //Create an embed with the uptime
        const embeduptime = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setAuthor({name: client.user.username, iconURL: client.user.avatarURL({dynamic: true}), url: client.github})
            .setTitle(`${client.user.username} uptime`)
            .setThumbnail('https://cdn.discordapp.com/attachments/659986745156304906/800870900895449118/emote.png')
            .addFields(
                { name: `*Ammount of time that ${client.user.username} has been active for*`, value: '_ _', inline: false },
                { name: actividad, value: '_ _', inline: false },
            )
        .setTimestamp()
        interaction.editReply({embeds:[embeduptime]})
    }
}