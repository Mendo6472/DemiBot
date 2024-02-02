//Discord
const Discord = require("discord.js")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the latency of the bot and the Discord API")
    .setDMPermission(false),
    //Sends an empty message and then edits that message with the time it took to send the message in ms
    //and the Discord API ping
    async run(client, interaction) {
        //starts counting the time
        const start = Date.now();
        interaction.reply({content :"_ _"}).then(m =>{
            const { EmbedBuilder } = require('discord.js');
            //stops counting time when the message was sent
            const end = Date.now();
            const pingEmbed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({name: client.user.username, iconURL: client.user.avatarURL({dynamic: true}), url: client.github})
	            .addFields(
                    //(end-start) is the time in ms it took to send the message
        	        { name: 'Ping:', value: `\`${end - start} ms\`` },
                    { name: 'Discord API ping:', value: `\`${client.ws.ping}ms\``},
	            )
	            .setTimestamp()
        //edit the message to have the embed with the pings
            m.edit({embeds:[pingEmbed]})
        })
	}
}