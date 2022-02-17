const { validationResult } = require("express-validator");
const Tweet = require("../models/tweet");
const Reply = require("../models/reply");
const { userRefExist } = require("../util/dbRefCheck");
const { Types } = require("mongoose");
const ITEMS_PER_PAGE = 15;
exports.replies = async (req, res, next) => {
  const tweetRef = req.params.tweetRef;
  const page = +req.query.page || 1;
  try {
    let replies = await Reply.aggregate([
      {    $match: {
        tweetRef:Types.ObjectId (tweetRef),
      },},
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "userRef",
      //     foreignField: "_id",
      //     as: "userRef",
      //   },
      // },
      
      

      // { $unwind: { path: "$userRef", preserveNullAndEmptyArrays: false } },
    
      {
        $project: {
          userRef: 1,
          tweetRef: 1,
          text: 1,
          createdAt: 1,
          updatedAt: 1,
          
          __v: 1,

          
        },
      },
    ]);
    res.status(200).json({ replies });
  } catch (err) {
    next(err);
  }
};

exports.addReply = async (req, res, next) => {
  const text = req.body.text;
  const tweetRef = req.params.tweetRef;
  const user = req.user;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const reply = new Reply({ userRef:user, tweetRef, text });

    await reply.save();
    

    res.status(201).json({ message: "Reply created.", reply });
  } catch (err) {
    next(err);
  }
};

exports.deleteReply = async (req, res, next) => {
  const replyId = req.params.replyId;

  try {
    const reply = await Reply.findOneAndDelete({
      _id: replyId,
      userRef: req.user._id,
    });
    if (!reply) return next();

    res.status(200).json({ message: "Reply deleted.", replyId });
  } catch (err) {
    next(err);
  }
};

exports.updateReply = async (req, res, next) => {
  const text = req.body.text;
  const replyId = req.params.replyId;

  try {
    const reply = await Reply.findOne({
      _id: replyId,
      userRef: req.user._id,
    }).populate("userRef");

    if (!userRefExist(tweet, next)) return next();

    reply.text = text;

    await reply.save();

    res.status(200).json({ message: "Reply updated.", reply });
  } catch (err) {
    next(err);
  }
};
