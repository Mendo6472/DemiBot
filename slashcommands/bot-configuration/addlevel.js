//Discord npm
const Discord = require("discord.js")

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

        //Get levels collection
        const collectionName = "levels";
        const collection = client.db.collection(collectionName);
        //Get levels from the database
        var levels = await collection.find({guild_id: guild}).toArray();
        //Check if the level is already in the rank system
        if(levels.find(l => l.level == level)){
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
        if(levels.find(l => l.role_id == role.id)){
            errorEmbed.setDescription("That role is already in the rank system!");
            return await interaction.editReply({ embeds:[errorEmbed], ephemeral: true });
        }
        //Add the level to the rank system
        await collection.insertOne({guild_id: guild, level: level, role_id: role.id});
        const confirmEmbed = new Discord.EmbedBuilder()
            .setTitle("✅ | Success")
            .setColor(client.color)
            .setDescription("Level " + level + " added to the rank system")
        await interaction.editReply({embeds:[confirmEmbed]});    
    }
}