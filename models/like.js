const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
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
  { timestamps: true }
);
likeSchema.index({ tweetRef: 1, userRef: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
 
