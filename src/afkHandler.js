const fs = require('fs');
const afkPath = "./db/afk.json"

// Function to handle AFK related logic
async function handleAFK(message, afk) {
    // Check if the afk JSON has a key for the guild
    if (afk[message.guild.id] == null) {
        return;
    }
    // Check if the user is afk
    if (afk[message.guild.id][message.author.id] != null) {
        // If they are, remove them from the afk list
        delete afk[message.guild.id][message.author.id];
        // Save the file
        fs.writeFileSync(afkPath, JSON.stringify(afk));
        // Alert the user
        message.reply("You are no longer afk");
    }

    // Check if the message mentions any users
    if (message.mentions.users.size == 0) {
        return;
    }

    // Check if one of the users mentioned is afk
    let mentionedAfkUser = null;
    let amountOfAfkUsersMentioned = 0;
    for (const [userId, user] of message.mentions.users.entries()) {
        if (afk[message.guild.id][userId] != null) {
            mentionedAfkUser = user;
            amountOfAfkUsersMentioned++;
        }
    }
    // If only one user is afk, alert the user
    if (amountOfAfkUsersMentioned === 1) {
        message.reply(`${mentionedAfkUser.username} is AFK: ${afk[message.guild.id][mentionedAfkUser.id]}`);
    // If multiple users are afk, alert the user
    } else if (amountOfAfkUsersMentioned > 1) {
        messages.reply("Multiple users that you have mentioned are AFK.");
    }
}

module.exports = {
    handleAFK,
};