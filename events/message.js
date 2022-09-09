const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const config = require('../config.js')
const { get } = require('request-promise-native')
const fs = require("fs");
const { classToPlain } = require("class-transformer");
const { getlength, log } = require("../functions");
const Pokemon = require("./../Classes/Pokemon");
let scool = new Set();
let lastSpawn;
let Guild = require('../models/guild.js');
let User = require("../models/user.js");
let Pokemons = require("../models/pokemons");
let levelUp = require("../db/levelup.js");
let Spawn = require("../models/spawn.js");
let pokemon = require("../db/pokemon.js");
let forms = require("../db/forms.js");
let primal = require("../db/primal.js");
let shinyDb = require("../db/shiny");
let Gen8 = require('../db/gen8.js')
let Galarian = require('../db/galarians.js')
let altnames = require("../db/altnames.js");
const spawn = require("../models/spawn.js");
const { set } = require("mongoose");
let color = '#FF5733';
const aSpawns = require("../db/aspawns.json");
let aSpawnsStarted = false;
let mCount = {};

const common = fs.readFileSync("./db/common.txt").toString().trim().split("\n").map(r => r.trim());
const alolan = fs.readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const mythic = fs.readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const legend = fs.readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const ub = fs.readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
const galarian = fs.readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim());

module.exports = async (client, message) => {
  const { cooldowns } = client;


  if (message.author.bot || !message.guild) return;
  let channel = client.channels.cache.get(client.config.channel);
  let prefix = [client.config.prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`]
  let guild = await Guild.findOne({ id: message.guild.id });
  if (!guild) await new Guild({ id: message.guild.id }).save();
  guild = await Guild.findOne({ id: message.guild.id })
  prefix = [guild.prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`]
  let prefixs = prefix;

  let user = await User.findOne({ id: message.author.id });

  if (!message.channel.permissionsFor(client.user.id).has("SEND_MESSAGES")) return;
  if (!message.channel.permissionsFor(client.user.id).has("VIEW_CHANNEL")) return;
  if (!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return;
  if (!message.channel.permissionsFor(client.user.id).has("ATTACH_FILES")) return;

let spawn = await Spawn.findOne({ id: message.channel.id })
  if (guild.spawnbtn && !message.content.toLowerCase().startsWith(prefix[0].toLowerCase())) {
    if(aSpawnsStarted == false) {
      aSpawnsStarted = true;
      if(aSpawns.channels.length) setInterval(() => {
        aSpawns.channels.forEach(ch => {
          spawnPokemon({channel: client.channels.cache.get(ch.split("..")[0]), guild: {id: ch.split("..")[1]}}, client)
        })
      }, 15000)
    }
try {
if(spawn.count >= 24) {
spawnPokemon(message, client)
spawn.count = 1
await spawn.save()
}
else {
spawn.count += 1
await spawn.save()
}
}
catch {
  let spawn = await Spawn.findOne({ id: message.channel.id });
  if (!spawn) await new Spawn({ id: message.channel.id }).save();
  spawn = await Spawn.findOne({ id: message.channel.id })
spawn.count += 1 
await spawn.save() 
}


    if (user) await leveling(message, client).catch(err => {
      if (err.message.toLowerCase().startsWith(`VersionError`)) return;
    })
  }

    if (message.content.startsWith(prefix[1])) prefix = prefix[1];
  else if (message.content.startsWith(prefix[2])) prefix = prefix[2];
  else prefix = prefix[0];

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(message.content) && !args[0]) {
    if (guild.blacklist == true) return message.channel.send("This server has been blacklisted. Join support server to appeal .");
    if (user && user.blacklist == true) return message.channel.send("Your account has been suspended.");
    let embed = new MessageEmbed()



    return message.channel.send(`The current prefix for this server is ${guild.prefix}`)
  }

  if (!args[0]) return;
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
  if (message.content.startsWith(prefix) && guild.blacklist == true) return message.channel.send("This server has been blacklisted. Join support server to appeal.");
  if (user && user.blacklist == true && message.content.startsWith(prefix)) return message.channel.send("Your account has been suspended.");
  if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
  if (cmd) {
    prefix = prefixs[0]
    if (!cooldowns.has(cmd.name)) {
      cooldowns.set(cmd.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.name);
    const cooldownAmount = cmd.cooldown * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        let tl = timeLeft.toFixed(1);
        if (tl < 60 && tl > 0) {
          tl = `${tl} seconds`
        }
        if (tl > 60 && tl < 3600) {
          tl = `${(tl / 60).toFixed(0)} minutes`
        }
        if (tl > 3600 && tl < 86400) {
          tl = `${(tl / 3600).toFixed(0)} hours`
        }
        if (tl > 86400 && tl < 604800) {
          tl = `${(tl / 86400).toFixed(0)} days`
        }
        return message.channel.send(`<:xmark:990685941486223422> \`You must wait  ${tl} before you can reuse this command!\` `);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    if (cmd.category.toLowerCase() == "dev" && !client.config.owners.includes(message.author.id)) return message.reply(`You do not own this bot`)
    if (cmd.category.toLowerCase() === "Dev2" && !client.config.asliMalik.includes(message.author.id)) return message.channel.reply(`This command can only be used by ${client.user.username} Owners.`);
    if (cmd.category == "Testing" && !client.config.owners.includes(message.author.id)) return message.reply("This command is under maintenance. Please check back later");
    if (cmd.args && !args.length) return message.channel.send(`See \`${capitalize(prefix)}help ${capitalize(cmd.name)}\` for more information on how to use the ${capitalize(cmd.name)} Command.`);
    if (cmd.permissions && !message.channel.permissionsFor(message.author.id).has(cmd.permissions)) return message.channel.send(`You don't have enough permissions to use this command.`);


    cmd.execute(client, message, args, prefix, guild, color, channel).catch(err => {
      if ([`versionerror`, `no matching document`, `missing permissions`].includes(err.message.toLowerCase())) return;
      if (err.message.includes(`404 - "Not Found"`))
      {
                              message.reply(
					'There Was An Error While Trying To Execute ' +
						command +
						' Command!```xl\n' +
						err +
						'```')

        return message.channel.send("This Pokémon doesn't seem to appear in the Pokedex or maybe you spelled it wrong!");
      }
             				
        })
    //log(`[${message.guild.name}/#${message.channel.name}] ${message.author.username} (${message.author.id}): ${prefix}${command} ${args.join(" ")}`)
        log(`\`\`\`Guild - ${message.guild.name}\nChannel - #${message.channel.name}\nUser - ${message.author.username} / ${message.author.id}\nCommand - ${prefix}${command} ${args.join(" ")}\`\`\``)
}


  
      }



 async function spawnPokemon(message, client) {

  let guild = await Guild.findOne({ id: message.guild.id });
  let channel = client.channels.cache.get(message.channel.id);
  if (!guild) await new Guild({ id: message.guild.id }).save();
  guild = await Guild.findOne({ id: message.guild.id })

  if (!guild.spawnbtn) return;
  if (guild.disabledChannels.includes(message.channel.id)) return;
  if (guild.spawnchannel !== null) channel = client.channels.cache.get(guild.spawnchannel);
  if (!channel) return;

  let spawn = await Spawn.findOne({ id: channel.id });
  if (!spawn) await new Spawn({ id: channel.id }).save();
  spawn = await Spawn.findOne({ id: channel.id })

  // if (spawn.pokemon[0]) return;// console.log(spawn.pokemon[0].name);
  //if (guild.spawnchannel && scool.has(message.channel.id)) return;
 // if (!guild.spawnchannel && scool.has(message.channel.id)) return;

    var gen = pickRandom();
  var type = common;
  if (gen == "common") type = common;
  if (gen == "alolan") type = alolan;
  if (gen == "mythic") type = mythic;
  if (gen == "legend") type = legend;
  if (gen == "ub") type = ub;
  if (gen == "galarian") type = galarian;
  var shiny = false
  //type = galarian
  gen = Math.floor(Math.random() * 4096);
  if (gen <= 10) shiny = true;
  const random = type[Math.floor(Math.random() * type.length)];
  var name = random.trim().split(/ +/g).join("-").toLowerCase();
  var findGen8 = Gen8.find(r => r.name === name);
  var Name = name;
  if (name.startsWith("alolan-")) {
    name = name.replace("alolan-", "");
    Name = `${name}-alola`
    name = random;
  };    // if (spawn.pokemon[0]) return;// console.log(spawn.pokemon[0].name);
  //if (guild.spawnchannel && scool.has(message.channel.id)) return;
  //if (!guild.spawnchannel && scool.has(message.channel.id)) return;

  const options = {
    url: `https://pokeapi.co/api/v2/pokemon/${Name}`,
    json: true
  };
  if (name.toLowerCase().startsWith("giratina")) options.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered";
  if (name.toLowerCase().startsWith("deoxys")) options.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal";
  if (name.toLowerCase().startsWith("shaymin")) options.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land";  
  if (name.toLowerCase().startsWith("nidoran♂")) options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
  if (name.toLowerCase().startsWith("nidoran♀️")) options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f";
  if (name.toLowerCase().startsWith(("porygon z") || "porygon-z")) options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z";
  if (name.toLowerCase().startsWith("landorus")) options.url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate";
  if (name.toLowerCase().startsWith("thundurus")) options.url = "https://pokeapi.co/api/v2/pokemon/thundurus-incarnate";
  if (name.toLowerCase().startsWith("tornadus")) options.url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate";
  if (name.toLowerCase().startsWith("mr.mime")) options.url = "https://pokeapi.co/api/v2/pokemon/mr-rime";
  if (name.toLowerCase().startsWith("pumpkaboo")) options.url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average";
  if (name.toLowerCase().startsWith("meowstic")) options.url = "https://pokeapi.co/api/v2/pokemon/meowstic-male";
  if (name.toLowerCase().startsWith("toxtricity")) options.url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped";
  if (name.toLowerCase().startsWith("mimikyu")) options.url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised";
  if (name.toLowerCase().startsWith("keldeo")) options.url = "https://pokeapi.co/api/v2/pokemon/keldeo-ordinary";
  if (name.toLowerCase().startsWith("zygarde")) options.url = "https://pokeapi.co/api/v2/pokemon/zygarde-50";
  if (name.toLowerCase().startsWith("darmanitan")) options.url = "https://pokeapi.co/api/v2/pokemon/darmanitan-standard";
  if (name.toLowerCase().startsWith("meloetta")) options.url = "https://pokeapi.co/api/v2/pokemon/meloetta-aria";
  if (name.toLowerCase().startsWith("basculin")) options.url = "https://pokeapi.co/api/v2/pokemon/basculin-red-striped";
  if (name.toLowerCase().startsWith("urshifu")) options.url = "https://pokeapi.co/api/v2/pokemon/urshifu-single-strike";
  if (name.toLowerCase().startsWith("gourgeist")) options.url = "https://pokeapi.co/api/v2/pokemon/gourgeist-average";
  if (name.toLowerCase().startsWith("lycanroc")) options.url = "https://pokeapi.co/api/v2/pokemon/lycanroc-midday";
  if (name.toLowerCase().startsWith("wishiwashi")) options.url = "https://pokeapi.co/api/v2/pokemon/wishiwashi-solo";
  if (name.toLowerCase().startsWith("minior")) options.url = "https://pokeapi.co/api/v2/pokemon/minior-red-meteor";
  if (name.toLowerCase().startsWith("indeedee")) options.url = "https://pokeapi.co/api/v2/pokemon/indeedee-male";
  if (name.toLowerCase().startsWith("morpeko")) options.url = "https://pokeapi.co/api/v2/pokemon/morpeko-full-belly";
  if (name.toLowerCase().startsWith("oricorio")) options.url = "https://pokeapi.co/api/v2/pokemon/oricorio-baile";
  if (name.toLowerCase().startsWith("eiscue")) options.url = "https://pokeapi.co/api/v2/pokemon/eiscue-ice  ";
    await get(options).then(async t => {
    let check = t.id.toString().length
    let url;

    if (!shiny) {
      if (check === 1) {
        url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
      } else if (check === 2) {
        url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
      } else if (check === 3 && !Name.endsWith("-alola")) {
        url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
      } else if (check > 3 && Name.endsWith("-alola")) {

        let t2 = await get({
          url: `https://pokeapi.co/api/v2/pokemon/${Name.replace("-alola", "")}`,
          json: true
        })

        let check2 = t2.id.toString().length
        url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t2.id}_f2.png`

        if (check2 === 1) {
          url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t2.id}_f2.png`
        } else if (check2 === 2) {
          url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t2.id}_f2.png`
        } else if (check2 === 3) {
          url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t2.id}_f2.png`
        }
      }
    } else {
      let get = shinyDb.find(r => r.name === Name);
      if (get) url = get.url;
      if (!get) url = `https://assets.poketwo.net/shiny/${t.id}.png?v=26`;
        }
    if (findGen8) url = findGen8.url;



    var re;
    const Type = t.types.map(r => {
      if (r !== r) re = r;
      if (re == r) return;
      return `${r.type.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`
    }).join(" | ");
    let lvl = Math.floor(Math.random() * 50)
    let poke = new Pokemon({ name: random, id: t.id, shiny: shiny, rarity: Type, url: url }, lvl);
    poke = await classToPlain(poke);
    if (shiny == true && Name.endsWith("alola")) {
      if (shinyDb.find(r => r.name.toLowerCase() === Name.toLowerCase())) url = shinyDb.find(r => r.name === Name).url;
    }
       
            let imgname = "pokelord.png"
    if (poke.url.endsWith(".gif")) imgname = "pokelord.gif"

    const embed = new MessageEmbed()
      .setAuthor("A wild pokémon has appeared!")
      .setDescription(`Guess the Pokémon аnd type \`${guild.prefix}catch <pokémon name>\` to cаtch it!`)
      .attachFiles([{ name: imgname, attachment: poke.url }])
      .setImage("attachment://" + imgname)
      .setFooter("")
      .setColor(color)

    let time
    if (guild.incense == true) {
      embed.setFooter(`Incense: ${guild.incense.toString().replace("true", "Active")}\nRemaining: ${guild.incenseamount }`)
      time = 5000
    }
    if (guild.incense == false) {
      time = 1000 - Math.floor(Math.random() * 1000)
    }






    if (scool.has(message.channel.id)) return;
     await channel.send(embed)
try {
spawn.pokemon = []
spawn.pokemon.push(poke)
await spawn.save()
}
catch {
try{
  let spawn = new Spawn({id: message.channel.id}).save()
spawn.pokemon = []
spawn.pokemon.push(poke)
await spawn.save()
}
  catch {}
} 
      setTimeout(async () => {
      if (guild.incense == true && guild.incenseamount >= 1) {
        guild.incenseamount = guild.incenseamount - 1
        await guild.save()
      }
      if (guild.incense == true && guild.incenseamount <= 0) {
        guild.incense = false
        await guild.save()
      }
      //await scool.delete(channel.id)
    }, time);

  }).catch(err => {
    if (err.message.includes(`404 - "Not Found"`)) return; // channel.send(`Unable to spawn this pokemon due to no availability of this pokemon.\nName: ${random}`);
    if (err.message.toLowerCase().startsWith(`VersionError`)) return;
console.log(err)
    // if(err.message.startsWith(`No matching document found for id`)) return;
  });//jb error aaye and no solution u have so return :)
}


//
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function pickRandom() {
  if ((Math.floor(Math.random() * 2000) + 1) <= 7) return 'alolan';
  if ((Math.floor(Math.random() * 1) + 1) <= 5) return 'legends';
  if ((Math.floor(Math.random() * 1) + 1) <= 10) return 'mythics';
  if ((Math.floor(Math.random() * 10) + 1) <= 100) return 'galarian';
  if ((Math.floor(Math.random() * 3000) + 1) <= 10) return 'ub';

  return 'common';

}

async function leveling(message, client) {
  let user = await User.findOne({ id: message.author.id });
  if (!user) return;
  if (user.blacklist) return;
  let selected = user.selected;
  let poke = user.pokemons[selected];
  if (!poke) return console.log("No poke found");
  //if (xpCooldown.has(message.author.id)) return;
  const guild = await Guild.findOne({ id: message.guild.id });
  let prefix = guild.prefix;
  if (message.content.startsWith(`${prefix}`)) return;
  if (poke.level == 100) return;
  let curxp = poke.xp;
  if (poke.level < 20) {
    x = Math.floor((Math.random() * 10)) + 20
  }
  if (poke.level > 10 && poke.level < 50) {
    x = Math.floor((Math.random() * 200)) + 50
  }
  if (poke.level > 51) {
    x = Math.floor((Math.random() * 300)) + 50
  }
  let newXp = curxp + x;
  let lvl = poke.level;
  let embed9 = new MessageEmbed()
    .setAuthor(`Congratulations ${message.author.username}!`)
    .setDescription(`Your${user.pokemons[selected].shiny ? " ✨" : ""} ${capitalize(user.pokemons[user.selected].name)} is now level ${poke.level + 1}.`)
    .setThumbnail(user.pokemons[selected].url)
    .setColor(color)

  var n = parseInt(poke.level)
  let neededXp = (1.2 * n ^ 3) - (15 * n ^ 2) + (100 * n) - 161;
  if (user.blacklist) return;
  if (newXp > neededXp) {
    poke.level = lvl + 1;
    poke.xp = 0;
    user.pokemons[selected] = poke;
    await user.markModified(`pokemons`);
    await user.save();



    for (var i = 0; i < levelUp.length; i++) {
      if (poke.name.toLowerCase() == levelUp[i].name.toLowerCase() && poke.level > levelUp[i].levelup) {
        msg = `Congratulations
${message.author}! Your \`${poke.shiny ? "✨": ""}${capitalize(poke.name)}\` is now level ${poke.level + 1} and Evolved into ${poke.shiny ? "✨" : ""} ${capitalize(levelUp[i].evo)}`;
        embed9.setDescription(msg)
        poke.name = capitalize(levelUp[i].evo);
        poke.xp = newXp;
        user.pokemons[selected] = poke;
        await user.markModified(`pokemons`);
        await user.save();
        return message.channel.send(embed9)
      }
    }
    //   setTimeout(() => xpCooldown.delete(message.author.id), 30000)
    return message.channel.send(embed9)
  } else {
    poke.xp = newXp;
    user.pokemons[selected] = poke;
    await user.markModified(`pokemons`);
    await user.save();
  }

}
