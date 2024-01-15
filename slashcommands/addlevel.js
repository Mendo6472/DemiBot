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
    //Command tag option
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
        
        var level = interaction.options.getInteger("level")
        var role = interaction.options.getRole("role")

        //Get the levels file
        var levelsFile = fs.readFileSync("./db/levels.json")
        //Parse the file
        var levels = JSON.parse(levelsFile)
        //Check if the level is already in the rank system
        if(levels[level] != null){
            //If it is, alert them
            await interaction.editReply({ content: "That level is already in the rank system!", ephemeral: true });
            return
        }
        //Add the level to the rank system
        levels[level] = role.id
        //Save the file
        fs.writeFileSync("./db/levels.json", JSON.stringify(levels))
        //Confirm the level
        await interaction.editReply("Level " + level + " added to the rank system");    
    }
}