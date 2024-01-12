const fs = require('fs');
const afkPath = "./db/afk.json"

// Function to handle AFK related logic
async function handleAFK(message, afk) {
    // Check if afk user talked
    if (afk[message.author.id] != null) {
        // If they are, remove them from the afk list
        delete afk[message.author.id];
        // Save the file
        fs.writeFileSync(afkPath, JSON.stringify(afk));
        // Alert the user
        message.reply("You are no longer afk");
    }

    // Check if the message mentions an afk user
    if (message.mentions.users.size == 0) {
        return;
    }

    // Check if one of the users mentioned is afk
    let mentionedAfkUser = null;
    let amountOfAfkUsersMentioned = 0;
    for (const [userId, user] of message.mentions.users.entries()) {
        if (afk[userId] != null) {
            mentionedAfkUser = user;
            amountOfAfkUsersMentioned++;
        }
    }

    if (amountOfAfkUsersMentioned === 1) {
        message.channel.send(`${mentionedAfkUser.username} is AFK: ${afk[mentionedAfkUser.userId]}`);
    } else if (amountOfAfkUsersMentioned > 1) {
        message.channel.send("Multiple users that you have mentioned are AFK.");
    }
}

module.exports = {
    handleAFK,
};