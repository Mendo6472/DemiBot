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
        .setMaxLength(255)),
    async run(client, interaction) {
        // Defering reply to avoid timeout
        await interaction.deferReply({ ephemeral: true });

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
            return await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        // If the user is not kickable, alert them
        if (!interaction.guild.members.cache.get(target.id).kickable) {
            errorEmbed.setDescription("That user is not kickable!");
            return await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Si el usuario que desea kickear tiene un rol superior al del usuario que ejecuto el comando.
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            errorEmbed.setDescription("I can't kick this user because it has the same role or a superior role to yours.");
            return await interaction.editReply({ embeds: [errorEmbed], ephermal: true });
        }
  
        // Si el usuario que desea kickear tiene un rol superior al del bot.
        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            errorEmbed.setDescription("I can't kick this user because it has the same role or a superior role to mine.");
            return await interaction.editReply({ embeds: [errorEmbed], ephermal: true });
        }

        // Si el usuario que desea kickear sea el propio bot.
        if (target.id === client.user.id) {
            errorEmbed.setDescription("No me puedo kickear a mi mismo.")
            return await interaction.editReply({ embeds: [errorEmbed], ephermal: true })
        }

        try {
            await member.kick({ reason })
            const kickEmbed = new Discord.EmbedBuilder()
              .setTitle("👞 | Kick")
              .setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}`)
              .setDescription(`An user has been kicked in this server.`)
              .addFields({ name: `▸ 👤 User`, value: `>>> **Username:** ${target.username}\n**ID:** ${target.id}` })
              .addFields({ name: `▸ 📄 Razón`, value: `>>> \`${reason}\`` })
              .setColor(client.color)
              .setTimestamp()
      
            await interaction.editReply({ embeds: [kickEmbed] })
          } catch (error) {
            errorEmbed.setDescription("An error has ocurred when trying to kick this user")
            await interaction.editReply({ embeds:[errorEmbed], ephemeral: true })
            console.error(error)
          }
    }
}