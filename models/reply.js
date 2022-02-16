const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
    text: {
      type: String,
      required: true,
     
    },
 
    tweetRef: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
      required: true,
      index: true,
    },
    userRef: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      
    },
  },
  { timestamps: true ,optimisticConcurrency:true}
);
 
module.exports = mongoose.model("Reply", replySchema);
