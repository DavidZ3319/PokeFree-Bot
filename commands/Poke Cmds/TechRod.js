const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native')
const fs = require("fs");
const { classToPlain } = require("class-transformer");
const { getlength } = require("../../functions");
const Pokemon = require("./../../Classes/Pokemon");
const User = require('../../models/user.js');
let Spawn = require('../../models/spawn.js')
let Guild = require('../../models/guild.js')
const Canvas = require('canvas')
 const canvas = Canvas.createCanvas(1192,670);
          const ctx = canvas.getContext('2d')


module.exports = {
  name: "techrod",
  description: "Hunt a wild pokemon every 3 minutes.",
  category: "Pokemon",
  args: false,
  usage: ["techrod"],
  cooldown: 10,
  permissions: [],
    aliases: ["nrd"],
    execute: async (client,message, args, prefix, guild, color, channel) => {

let user = await User.findOne({ id: message.author.id });
  if(!user) return message.channel.send("You haven't started yet!")
 if(user.techfishingrod === 0) return message.channel.send(">  Please Buy A Tech Fishing Rod To Fish")
      let names = ["feebas","finneon","goldeen","gorebyss","huntail","lanturn","luvdisc","magikarp","qwilfish","seaking","stunfisk","tynamo","relicanth","horsea","seadra","remoraid","octillery","kingdra","seadra","tentacool","tentacruel","staryu","starmie","shelder","cloyster","clampearl","corsola","manaphy","phione","keldeo","palkia","kyogre","lapras","suicune","lugia","articuno","dratini","dragonair","dragonite","blastoise"]
 let name = names[Math.floor(Math.random() * names.length)]



    let ab = {
     url: `https://pokeapi.co/api/v2/pokemon/${name}`,
      json: true
    }    
  let embedx;
    await get(ab).then(async x => {
       let check = x.id.toString().length
        if (check === 1) {
            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${x.id}.png`
          } else if (check === 2) {
            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${x.id}.png`
          } else if (check === 3) {
            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${x.id}.png`
          }
    var shiny = false
    //type = galarian
    gen = Math.floor(Math.random() * 8096);
    if (gen <= 10) shiny = true;
       let lvl = Math.floor(Math.random()*69) + 1
       let pokemon = new Pokemon({ name: x.name.toLowerCase(), id: x.id, shiny: shiny,  url: url }, lvl);

       pokemon = await classToPlain(pokemon)

                              let imgname = 'new.png'
       let spawn = await Spawn.findOne({id: message.channel.id})
       if (!spawn) await new Spawn({ id: message.channel.id }).save();
       spawn = await Spawn.findOne({id: message.channel.id})
       spawn.pokemon = []
       spawn.pokemon.push(pokemon)
       spawn.time = 259200000 + Date.now()
       await spawn.save()

        user.techroduse = user.techroduse + 1
      await user.save()
  let bg = "https://media.discordapp.net/attachments/794187043864313887/864585047242571776/underwater-near-ocean-surface-with-rising-bubbles-in-blue-sea-incredivfx.png?width=720&height=405";
       ;
          const background = await Canvas.loadImage(bg)
          ctx.drawImage(background,0,0,canvas.width,canvas.height)
          const pk = await Canvas.loadImage(pokemon.url)
          ctx.drawImage(pk,300,100,550,550)
       embedy = new Discord.MessageEmbed()
      .setAuthor(`Threw The Tech Rod Into Water`)
    .setImage(`https://media.discordapp.net/attachments/1010448777812914179/1011305376827834409/InShot_20220822-1661184191711.gif`)
           embedx = new Discord.MessageEmbed()
            .setAuthor(`Oh a Wild pokemon has Appeared!`)
            .setDescription(`Guess the Pokemon ????nd type \`${guild.prefix}catch <pokemon name>\` or \`p!pokeball\` to c????tch it!`)
             .setColor('#add8e6')
             .attachFiles([{ name: "new.png", attachment: canvas.toBuffer() }])
            .setImage("attachment://" + "new.png")
    })
    message.channel.send(embedy).then(sentMessage => {
    setTimeout(() => {
        sentMessage.edit('A New Pokemon Has Been Hunted')
      return message.channel.send(embedx)
    }, 7000);
      
    
})
  
}
}