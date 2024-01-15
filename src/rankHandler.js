//fs
const fs = require("fs");

async function handleRank(message, ranks){
    if(!ranks[message.author.id]){
        ranks[message.author.id] = {
            xp: 0,
            level: 1,
            nextLevelXp: 300,
            rank: ranks.length + 1,
            lastMessage: new Date().getTime()
        };
        fs.writeFile("./db/rank.json", JSON.stringify(ranks), (err) => {
            if(err) console.log(err);
        });
    }
    let lastMessage = ranks[message.author.id].lastMessage;
    if(new Date().getTime() - lastMessage < 60000) return;
    const randomXp = Math.floor(Math.random() * 10) + 1;
    ranks[message.author.id].xp += randomXp;
    let userXp = ranks[message.author.id].xp;
    let userLevel = ranks[message.author.id].level;
    let nextLevelXp = ranks[message.author.id].nextLevelXp;
    //Calculate player top position
    let userRank = await getPlayerRank(message.author.id, ranks);
    ranks[message.author.id].rank = userRank;

    //Calculate player level
    if(nextLevelXp <= userXp){
        let newLevel = ranks[message.author.id].level + 1;
        ranks[message.author.id].level = newLevel;
        ranks[message.author.id].xp = 0;
        ranks[message.author.id].nextLevelXp = ((userLevel + 11) * 2) ** 2;
        let levels = JSON.parse(fs.readFileSync("./db/levels.json"));
        if(levels[newLevel]){
            message.member.roles.add(levels[newLevel]);
        }
        message.reply(`You leveled up to level ${ranks[message.author.id].level}`);   
    }

    fs.writeFile("./db/rank.json", JSON.stringify(ranks), (err) => {
        if(err) console.log(err);
    });
}

async function getPlayerRank(userId, ranks) {
    const sortedRanks = Object.keys(ranks).sort((a, b) => {
        const playerA = ranks[a];
        const playerB = ranks[b];

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