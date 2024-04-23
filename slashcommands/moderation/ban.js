//Discord npm
const Discord = require("discord.js")
//fs
const fs = require("fs")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("ban")
    .setDescription("Command to ban a user from the server")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption(  option =>
        option.setName("user")
        .setDescription("User to ban")
        .setRequired(true))
    .addStringOption(option =>
        option.setName("reason")
        .setDescription("Reason to ban the user")
        .setRequired(false)
        .setMinLength(1)
        .setMaxLength(255))
    .addBooleanOption(option =>
        option.setName("dm")
        .setDescription("Send a DM to the user with the reason")
        .setRequired(false)),
    async run(client, interaction) {
        // Creating an embed to send errors
        const errorEmbed = new Discord.EmbedBuilder()
            .setTitle("❌ | Error")
            .setColor("#fc0000")

        const target = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No reason provided";
        const member = await interaction.guild.members.fetch(target.id)

        // If the user is trying to ban themselves, alert them
        if (interaction.user.id === target.id) {
            errorEmbed.setDescription("You can't ban yourself!");
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // If the user that wants to ban has a higher role than the user to be banned.
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            errorEmbed.setDescription("I can't ban this user because it has the same role or a superior role to yours.");
            return await interaction.reply({ embeds: [errorEmbed], ephermal: true });
        }
  
        // If the user that wants to ban has a higher role than the bot.
        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            errorEmbed.setDescription("I can't ban this user because it has the same role or a superior role to mine.");
            return await interaction.reply({ embeds: [errorEmbed], ephermal: true });
        }

        // If the user is trying to ban the bot, alert them
        if (target.id === client.user.id) {
            errorEmbed.setDescription("I can't ban myself!");
            return await interaction.reply({ embeds: [errorEmbed], ephermal: true })
        }

        try {
            await member.ban({ reason })
            //Send a DM to the user with the reason
            if (interaction.options.getBoolean("dm")) {
                const dmEmbed = new Discord.EmbedBuilder()
                    .setTitle("🔨 | Banned")
                    .setDescription(`You have been banned from the server **${interaction.guild.name}**.`)
                    .addFields({ name: "▸ 📄 Reason", value: `>>> ${reason}` })
                    .setColor(client.color)
                    .setTimestamp()
                target.send({ embeds: [dmEmbed] })
            }
            //Send a reply to the interaction
            const kickEmbed = new Discord.EmbedBuilder()
                .setTitle("🔨 | Ban")
                .setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}`)
                .setDescription(`An user has been banned in this server.`)
                .addFields({ name: `▸ 👤 User`, value: `>>> **Username:** ${target.username}\n**ID:** ${target.id}` })
                .addFields({ name: `▸ 📄 Reason`, value: `>>> ${reason}` })
                .setColor(client.color)
                .setTimestamp()
            interaction.reply({ embeds: [kickEmbed], ephemeral: false})
          } catch (error) {
            errorEmbed.setDescription("An error has ocurred when trying to ban this user")
            await interaction.reply({ embeds:[errorEmbed], ephemeral: true})
            console.error(error)
          }
    }
}