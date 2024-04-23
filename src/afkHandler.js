// Function to handle AFK related logic
async function handleAFK(message, client) {
    const collectionName = "afk";
    const collection = client.db.collection(collectionName);
    // Check if the user is afk
    const result = await collection.deleteMany({ user_id: message.author.id, guild_id: message.guild.id });
    if (result.deletedCount > 0) {
        return message.reply("You are no longer afk");
    }

    // Check if the message mentions any users
    if (message.mentions.users.size == 0) {
        return;
    }

    // Check if one of the users mentioned is afk
    const [userId] = message.mentions.users.entries();
    const usersResult = await collection.find({ user_id: { $in: userId }, guild_id: message.guild.id }).toArray();
    // If only one user is afk, alert the user
    if (usersResult.length === 1) {
        mentionedId = usersResult[0].user_id;
        userMessage= usersResult[0].message;
        const user = userId.find(user => user.id === mentionedId);
        message.reply(`${user.username} is AFK: ${userMessage}`);
    // If multiple users are afk, alert the user
    } else if (usersResult.length > 1) {
        message.reply("Multiple users that you have mentioned are AFK.");
    }
}

module.exports = {
    handleAFK,
};