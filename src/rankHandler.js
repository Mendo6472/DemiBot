async function handleRank(message, client){
    const guildId = message.guild.id;
    const userId = message.author.id;
    const collectionName = "rank";
    const collection = client.db.collection(collectionName);
    const user = await collection.findOne({ user_id: userId, guild_id: guildId });
    if(!user){
        rank = {
            user_id: userId,
            guild_id: guildId,
            xp: 0,
            level: 1,
            nextLevelXp: 300,
            lastMessage: new Date().getTime()
        };
        return await collection.insertOne(rank);
    }
    let lastMessage = user.lastMessage;
    if(new Date().getTime() - lastMessage < 60000) return;
    const randomXp = Math.floor(Math.random() * 15) + 1;
    user.xp += randomXp;
    user.lastMessage = new Date().getTime();
    let userXp = user.xp;
    let userLevel = user.level;
    let nextLevelXp = user.nextLevelXp;
    //Calculate player top position
    let userRank = await getPlayerRank(message.author.id, collection, message.guild.id);
    //Calculate player level
    if(nextLevelXp <= userXp){
        let newLevel = user.level + 1;
        user.level = newLevel;
        user.xp = 0;
        user.nextLevelXp = ((userLevel + 11) * 2) ** 2;
        message.reply(`You leveled up to level ${user.level}`);   
        saveRank(user, collection)
        const levelsCollectionName = "levels";
        const levelsCollection = client.db.collection(levelsCollectionName);
        const level = await levelsCollection.findOne({ guild_id: message.guild.id, level: newLevel});
        if(level){
            let newRole = message.guild.roles.cache.get(level.role_id);
            if(newRole == null) return;
            if(message.member.roles.cache.has(newRole.id)) return;
            if(newRole.rawPosition >= message.guild.members.me.roles.highest.position) return;
            message.member.roles.add(newRole);
        }
    } else {
        await saveRank(user, collection);
    }
}

async function getPlayerRank(userId, collection, guildId) {
    const users = await collection.find({ guild_id: guildId }).toArray();
    if (users.length === 1) {
        return 1;
    }
    users.sort((a, b) => {
        // Sort by level first
        if (a.level !== b.level) {
            return b.level - a.level;
        } else {
            // If levels are equal, sort by XP
            return b.xp - a.xp;
        }
    });

    // Find the index of the user in the sorted ranks    
    const userIndex = users.findIndex(user => user.user_id === userId);
    // Index starts from 0, so add 1 to get the rank
    const userRank = userIndex + 1;

    return userRank;
}


async function saveRank(user, collection){
    await collection.updateOne({ user_id: user.user_id, guild_id: user.guild_id }, { $set: user });
}

module.exports = {
    handleRank,
    getPlayerRank,
}