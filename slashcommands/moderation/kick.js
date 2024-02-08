//Discord npm
const Discord = require("discord.js")
//fs
const fs = require("fs")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("kick")
    .setDescription("Command to kick a user from the server")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption(  option =>
        option.setName("user")
        .setDescription("User to kick")
        .setRequired(true))
    .addStringOption(option =>
        option.setName("reason")
        .setDescription("Reason to kick the user")
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

        // If the user is trying to kick themselves, alert them
        if (interaction.user.id === target.id) {
            errorEmbed.setDescription("You can't kick yourself!");
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // If the user is not kickable, alert them
        if (!interaction.guild.members.cache.get(target.id).kickable) {
            errorEmbed.setDescription("That user is not kickable!");
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Si el usuario que desea kickear tiene un rol superior al del usuario que ejecuto el comando.
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            errorEmbed.setDescription("I can't kick this user because it has the same role or a superior role to yours.");
            return await interaction.reply({ embeds: [errorEmbed], ephermal: true });
        }
  
        // Si el usuario que desea kickear tiene un rol superior al del bot.
        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            errorEmbed.setDescription("I can't kick this user because it has the same role or a superior role to mine.");
            return await interaction.reply({ embeds: [errorEmbed], ephermal: true });
        }

        // Si el usuario que desea kickear sea el propio bot.
        if (target.id === client.user.id) {
            errorEmbed.setDescription("I can't kick myself!")
            return await interaction.reply({ embeds: [errorEmbed], ephermal: true })
        }

        try {
            await member.kick({ reason })
            //Send a DM to the user with the reason
            if (interaction.options.getBoolean("dm")) {
                const dmEmbed = new Discord.EmbedBuilder()
                    .setTitle("👞 | Kicked")
                    .setDescription(`You have been kicked from the server **${interaction.guild.name}**.`)
                    .addFields({ name: "▸ 📄 Reason", value: `>>> ${reason}` })
                    .setColor(client.color)
                    .setTimestamp()
                target.send({ embeds: [dmEmbed] })
            }
            //Send a reply to the interaction
            const kickEmbed = new Discord.EmbedBuilder()
              .setTitle("👞 | Kick")
              .setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}`)
              .setDescription(`An user has been kicked in this server.`)
              .addFields({ name: `▸ 👤 User`, value: `>>> **Username:** ${target.username}\n**ID:** ${target.id}` })
              .addFields({ name: `▸ 📄 Reason`, value: `>>> ${reason}` })
              .setColor(client.color)
              .setTimestamp()
      
            interaction.reply({ embeds: [kickEmbed], ephemeral: false})
          } catch (error) {
            errorEmbed.setDescription("An error has ocurred when trying to kick this user")
            await interaction.reply({ embeds:[errorEmbed], ephemeral: true})
            console.error(error)
          }
    }
}