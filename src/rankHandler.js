//fs
const fs = require("fs");

async function handleRank(message, ranks){
    if(!ranks[message.guild.id]){
        ranks[message.guild.id] = {};
    }
    if(!ranks[message.guild.id][message.author.id]){
        ranks[message.guild.id][message.author.id] = {
            xp: 0,
            level: 1,
            nextLevelXp: 300,
            rank: ranks[message.guild.id].length ? ranks[message.guild.id].length + 1 : 1,
            lastMessage: new Date().getTime()
        };
        return await saveRank(ranks);
    }
    let lastMessage = ranks[message.guild.id][message.author.id].lastMessage;
    if(new Date().getTime() - lastMessage < 60000) return;
    const randomXp = Math.floor(Math.random() * 10) + 1;
    ranks[message.guild.id][message.author.id].xp += randomXp;
    ranks[message.guild.id][message.author.id].lastMessage = new Date().getTime();
    let userXp = ranks[message.guild.id][message.author.id].xp;
    let userLevel = ranks[message.guild.id][message.author.id].level;
    let nextLevelXp = ranks[message.guild.id][message.author.id].nextLevelXp;
    //Calculate player top position
    let userRank = await getPlayerRank(message.author.id, ranks, message.guild.id);
    ranks[message.guild.id][message.author.id].rank = userRank;
    //Calculate player level
    if(nextLevelXp <= userXp){
        let newLevel = ranks[message.guild.id][message.author.id].level + 1;
        ranks[message.guild.id][message.author.id].level = newLevel;
        ranks[message.guild.id][message.author.id].xp = 0;
        ranks[message.guild.id][message.author.id].nextLevelXp = ((userLevel + 11) * 2) ** 2;
        let levels = JSON.parse(fs.readFileSync("./db/levels.json"));
        message.reply(`You leveled up to level ${ranks[message.guild.id][message.author.id].level}`);   
        saveRank(ranks);
        if(levels[message.guild.id] == null) return;
        if(levels[message.guild.id][newLevel]){
            let newRole = message.guild.roles.cache.get(levels[message.guild.id][newLevel]);
            if(newRole == null) return;
            if(message.member.roles.cache.has(newRole.id)) return;
            if(role.rawPosition >= interaction.guild.members.me.roles.highest.position) return;
            message.member.roles.add(newRole);
        }
    } else {
        await saveRank(ranks);
    }
}

async function saveRank(ranks){
    fs.writeFile("./db/rank.json", JSON.stringify(ranks), (err) => {
        if(err) console.log(err);
    });
}

async function getPlayerRank(userId, ranks, guildId) {
    // If there's only one player, return 1
    if (Object.keys(ranks[guildId]).length === 1) {
        return 1;
    }
    const sortedRanks = Object.keys(ranks[guildId]).sort((a, b) => {
        const playerA = ranks[guildId][a];
        const playerB = ranks[guildId][b];

        if (playerA.level !== playerB.level) {
            return playerB.level - playerA.level; // Sort by level first
        } else {
            return playerB.xp - playerA.xp; // If levels are equal, sort by XP
        }
    });

    // Find the index of the user in the sorted ranks
    const userRank = sortedRanks.indexOf(userId) + 1;

    return userRank;
}

module.exports = {
    handleRank,
}