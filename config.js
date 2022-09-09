 module.exports = {
   	logChannel: '1010448777812914179',
	bugchannelid: '1010448777523515442',
	feedbackchannelid: '1010448777364123715',
	tradechannelid: '1010448777812914179',
	suggestionchannelid: '1010448777812914179',
   
  prefix: "p!",
  server: "https://dsc.gg/pokefree",
token: (process.env.token), // this will be your bot token
  yes: "✅",
  no: "❌",

  owners: ["8775773368334965","9689160104050708","76399136338439500","7408938086449202","8951419673429734", "96455473951998366"], // this will be the users with all perms

  special: ["74808938086449202","74890893886449202",], 

  mongo_atlas: {
    username: process.env.username, 
    password: process.env.password,
    cluster: process.env.cluster,
    shard: {
      one: process.env.shard1,
      two: process.env.shard2,
      three: process.env.shard3
    }
  }, 
  webhooks: {
    cmd: {
      ID: '961289345862606848',
      Token: process.env.cmd
    },
    guild: {
      ID: '976088170154295327',
      Token: process.env.guildtoken
    },
	vote: {
		ID: '982718196605927534',
		Token: process.env.vote
	}
  },
  cooldown: 100,
  
  topgg: {
	  auth: "",
	  token: ""
    }
};

