const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true },
    balance: { type: Number, default: 0 },
    xp: { type: Number, default: 100 },
    level: { type: Number, default: 1 },
    selected: { type: Number, default: 0 },
    pokemons: { type: Array, default: [] },
    redeems: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    shards: { type: Number, default: 0 },
    badges: { type: Array, default: [] },
    released: { type: Number, default: 0 },
    orderAlphabet: { type: Boolean, default: false },
    orderIV: { type: Boolean, default: false },
    orderLevel: { type: Boolean, default: false },
    lbhide: { type: Boolean, default: false },
    shinyCaught: { type: Number, default: 0 },
    caught: { type: Array, default: [] },
    blacklist: { type: Boolean, default: false },
    createdAt: { type: String, default: Date.now() },
    lbcaught: { type: Number, default: 0 },
    shcount: { type: Number, default: 0 },
    shname: { type: String, default: null },
    bronzecrate: { type: Number, default: 0 },
    silvercrate: { type: Number, default: 0 },
    goldencrate: { type: Number, default: 0 },
    diamondcrate: { type: Number, default: 0 },
    deluxecrate: { type: Number, default: 0 },
    trade : { type: Boolean, default: false },
    commonegg: {type:Number, default: 0},
 questcaught: {type:Number, default: 0},
  questclaim: {type:Number, default: 0},
  questclaim2: {type:Number, default: 0},
   questclaim3: {type:Number, default: 0},
  questclaim4: {type:Number, default: 0},
  openedegg: {type:Number, default: 0},
rareegg: {type:Number, default: 0},
legendaryegg: {type:Number, default: 0},
  hatchedcommon: {type:Number, default: 0},
  hatchedrare: {type:Number, default: 0},
    hatchedlegendary: {type:Number, default: 0},
  

  /*>>  Common Eggs : ${user.commonegg}
      Rare Eggs : ${user.rareegg}
      Legendary Eggs : ${user.legendaryegg} */
  owner: {type:Number, default: 0},
oldfishingrod: {type:Number, default: 0},
  newfishingrod: {type:Number, default: 0},
  techfishingrod: {type:Number, default: 0},
  oldhuntingriffle: {type:Number, default: 0},
  newhuntingriffle: {type:Number, default: 0},
  techhuntingriffle: {type:Number, default: 0},
  oldroduse: {type:Number, default: 0},
   newroduse: {type:Number, default: 0},
   techroduse: {type:Number, default: 0},
   huntuse: {type:Number, default: 0}
});

module.exports = mongoose.model("User", UserSchema);