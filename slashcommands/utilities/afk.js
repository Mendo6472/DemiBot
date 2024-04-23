// Discord npm
const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        // Command name and description
        .setName("afk")
        .setDescription("Tell everyone you're afk and leave a message")
        .setDMPermission(false)
        // Command tag option
        .addStringOption(option =>
            option.setName("message")
                .setDescription("Message to leave when someone pings you (Leave empty for no message)")
                .setRequired(false)), // This option is not required
    async run(client, interaction) {
        // Defering reply to avoid timeout
        await interaction.deferReply();

        var message = "";
        if (interaction.options.getString("message") != null) {
            message = interaction.options.getString("message");
        }

        const collectionName = "afk";
        const collection = client.db.collection(collectionName);

        const afkData = {
            user_id: interaction.user.id,
            guild_id: interaction.guildId,
            message: message
        };

        // Check if the user is already afk
        const user = await collection.findOne({ user_id: interaction.user.id , guild_id: interaction.guildId});
        if (user) {
            return interaction.editReply("You are already afk!", {ephemeral: true});
        }
        await collection.insertOne(afkData);
        await interaction.editReply(interaction.user.username + " is now afk!");
    }
};
