const Discord = require("discord.js")
const OS = require("os");
const moment = require("moment");
require("moment-duration-format")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Shows the ammount of time that DemiBot has been active for")
    .setDMPermission(false),
    async run(client, interaction) {
        const actividad = moment.duration(client.uptime).format(" D [Days], H [Hours], m [Minutes], s [Seconds]");
        const embeduptime = new Discord.EmbedBuilder()
        .setColor('0000FF')
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()} )
        .setTitle("Silly Bot Uptime")
        .setThumbnail('https://cdn.discordapp.com/attachments/659986745156304906/800870900895449118/emote.png')
        .addFields(
            { name: '*Ammount of time that DemiBot has been active for*', value: '_ _', inline: false },
        )
        .addFields(
            { name: actividad, value: '_ _', inline: false },
        )
        .setTimestamp()
        interaction.reply({embeds:[embeduptime]})
    }
}