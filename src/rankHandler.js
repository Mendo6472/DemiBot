//fs
const fs = require("fs");

async function handleRank(message, ranks){
    if(!ranks[message.author.id]){
        ranks[message.author.id] = {
            xp: 0,
            level: 1,
            nextLevelXp: 300,
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
    if(nextLevelXp <= userXp){
        ranks[message.author.id].level++;
        ranks[message.author.id].xp = 0;
        ranks[message.author.id].nextLevelXp = ((userLevel + 11) * 2) ^ 2;
        message.reply(`You leveled up to level ${ranks[message.author.id].level}`);   
    }

    fs.writeFile("./db/rank.json", JSON.stringify(ranks), (err) => {
        if(err) console.log(err);
    });
}

module.exports = {
    handleRank,
}