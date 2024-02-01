//Discord npm
const Discord = require("discord.js")
//fs
const fs = require("fs")

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("addlevel")
    .setDescription("Add an special level to the rank system")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageRoles)
    .setDMPermission(false)
    //Level and role options
    .addIntegerOption(  option =>
        option.setName("level")
        .setDescription("Level to add to the rank system")
        .setRequired(true))
    .addRoleOption(option => 
        option.setName("role")
        .setDescription("Role to give to the user when leveling up to the level")
        .setRequired(true)),
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()

        // Creating an embed to send errors
        const errorEmbed = new Discord.EmbedBuilder()
            .setTitle("❌ | Error")
            .setColor("#fc0000")
        
        //Get the level and the role from the interaction
        var level = interaction.options.getInteger("level")
        var role = interaction.options.getRole("role")
        var guild = interaction.guildId

        //Get the levels file
        var levelsFile = fs.readFileSync("./db/levels.json")
        //Parse the file
        var levels = JSON.parse(levelsFile)
        //Check if the server is already in the rank system
        if(levels[guild] == null){
            levels[guild] = {}
        }
        //Check if the level is already in the rank system
        if(levels[guild][level] != null){
            errorEmbed.setDescription("That level is already in the rank system!");
            return await interaction.editReply({embeds:[errorEmbed], ephemeral: true });
        }
        //Check if the role is managed (A bot's role or a weebhook's role)
        if(role.managed){
            errorEmbed.setDescription("You can't add this role to the rank system!");
            return await interaction.editReply({ embeds:[errorEmbed], ephemeral: true });
        }
        //Check if the role is higher than the bot's highest role
        if(role.rawPosition >= interaction.guild.members.me.roles.highest.position){
            errorEmbed.setDescription("I can't add this role to the rank system!");
            return await interaction.editReply({ embeds:[errorEmbed], ephemeral: true });
        }
        //Check if the role is already on the rank system
        if(Object.values(levels).includes(role.id)){
            errorEmbed.setDescription("That role is already in the rank system!");
            return await interaction.editReply({ embeds:[errorEmbed], ephemeral: true });
        }
        //Add the level to the rank system
        levels[guild][level] = role.id
        //Save the file
        fs.writeFileSync("./db/levels.json", JSON.stringify(levels))
        //Confirm the level
        const confirmEmbed = new Discord.EmbedBuilder()
            .setTitle("✅ | Success")
            .setColor("#00fc3b")
            .setDescription("Level " + level + " added to the rank system")
        await interaction.editReply({embeds:[confirmEmbed]});    
    }
}