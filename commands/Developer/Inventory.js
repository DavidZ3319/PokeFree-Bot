const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
    name: "inventory",
    description: "complete quests for reward",
    category: "Pokemon",
    args: false,
    usage: ["inventory"],
    cooldown: 3,
    permissions: [],
    aliases: ["inv","box","backpack","bag"],
    execute: async (client, message, args, prefix, guild, color, channel) => {

  let user = await User.findOne({ id: message.author.id });
  if(!user) return message.channel.send("You haven't started yet!")
      
    let embed = new MessageEmbed()
      .setColor(color)
      .setAuthor(`${message.author.username}'s Inventory`)
   .setDescription(`You Can Currently Own Fishing Rods, Hunting Riffles, Axe For Digging`)
      .addField("**__FISHING ROD:__**",
`>>>  Old Rod : ${user.oldfishingrod}
      New Rod : ${user.newfishingrod}
      Tech Rod : ${user.techfishingrod} `)
    .setFooter(`Page 1/1`)
       .addField("**__HUNTING RIFFLE:__**",
`>>>  Old Hunting Riffle : ${user. oldhuntingriffle}
      New Hunting Riffle : ${user.newhuntingriffle}
     Tech Hunting Riffle : ${user.techhuntingriffle} `)
    .setFooter(`Page 1/1`)
      
          return message.channel.send(embed)
    }
}