const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const config = require('../../config.js')
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
    name: "support",
    description: "get the support server link",
    category: "misc",
    args: false,
    usage: ["support"],
    permissions: [],
    aliases: ["soporte"],
    execute: async (client, message, args, prefix, guild, color, channel) => {

      let embed = new MessageEmbed()
      .setDescription(`**[Click Aquí](https://discord.gg/FT6ZV5AGVf) para unirte al servidor de soporte.!!**`)
      .setColor(color)
      message.channel.send(embed)

    }
}