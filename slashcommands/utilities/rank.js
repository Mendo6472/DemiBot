//Discord npm
const Discord = require('discord.js');
//fs npm, required to load commands from different folders
const fs = require('fs').promises;
//Canvas to build the rank image
const { createCanvas, loadImage } = require('canvas');
//Calculate player rank
const { getPlayerRank } = require('../../src/rankHandler.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
    //Command name and description
    .setName("rank")
    .setDescription("Get your rank or someone else's")
    .setDMPermission(false)
    //Command user option
    .addUserOption(option =>
        option
        .setName('user')
        .setDescription('User to get the rank from (Leave empty for your own rank)')
        .setRequired(false)),
    async run(client, interaction) {
        //Defering reply to avoid timeout
        await interaction.deferReply()
        //Target will be the user inputed into the "user" option on the interaction
        var target = interaction.options.getUser('user');
        //If they didn't choose any user, the target will be the same user who used the interaction
        if(target == null) target = interaction.user;
        //If target is a bot, return
        if(target.bot) return await interaction.editReply("Bots don't have ranks!");
        //Get the guild id
        const guildId = interaction.guildId;
        const userId = target.id;
        const collectionName = "rank";
        const collection = client.db.collection(collectionName);
        //Check for user in rank collection
        const user = await collection.findOne({ user_id: userId, guild_id: guildId });
        if (!user) { return await interaction.editReply("This user doesn't have a rank yet!"); }
        let userLevel = user.level;
        let userXp = user.xp;
        let nextLevelXp = user.nextLevelXp;
        let userRank = await getPlayerRank(target.id, collection, guildId);
        let userName = target.username;
        let userAvatar = target.displayAvatarURL({size: 512, extension: "png"});

        //Create canvas 

        const canvasWidht = 800;
        const canvasHeight = 178;

        const canvas = createCanvas(canvasWidht, canvasHeight);
        const ctx = canvas.getContext('2d');

        // Load background image
        const background = await loadImage('./misc/rank_background.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Draw user avatar
        const avatar = await loadImage(userAvatar);
        ctx.drawImage(avatar, 25, 25, 128, 128);

        function roundRect(x, y, width, height, radius) {
            const maxRadius = Math.min(width / 2, height / 2);
            radius = Math.min(radius, maxRadius);

            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath();
        }

        // Draw level bar
        ctx.fillStyle = '#4a4949'; // Gray color
        roundRect(178, 113, canvasWidht-203, 40, 20); 
        ctx.fill();

        // Draw level progress bar
        const progressWidth = (userXp / nextLevelXp) * (canvasWidht-203);
        ctx.fillStyle = '#3504c9'; // Purle blue color
        roundRect(178, 113, progressWidth, 40, 20); 
        ctx.fill();

        // Draw text
        ctx.fillStyle = '#FFFFFF'; // White color
        ctx.font = '28px sans-serif';
        // Output the available font families
        const levelText = `Rank: ${userRank} Level: ${userLevel}`;
        const textWidth = ctx.measureText(levelText).width;
        ctx.fillText(levelText, canvasWidht - textWidth - 25, 93);
        ctx.fillText(userName, 178, 53);
        ctx.fillText(`${userXp} / ${nextLevelXp} XP`, 178, 93);
        

        // Send the canvas as an attachment
        await interaction.editReply({ files: [canvas.createPNGStream()] });

    }
}