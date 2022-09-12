const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
    name: "invite",
    description: "invite the bot to your server",
    category: "miscellaneous",
    args: false,
    usage: ["invite"],
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {

      
      let embed = new MessageEmbed()
      .setDescription(`**[Click Here To Invite Me](https://discord.com/oauth2/authorize?client_id=1008538206603595806&permissions=517611060433&scope=bot%20applications.commands)**`)
      .setFooter("Gracias por invitar al bot")
      .setColor(color)
      message.channel.send(embed)

    }
}