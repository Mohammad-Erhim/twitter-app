const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blackListTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blackListToken", blackListTokenSchema);
