const { validationResult } = require("express-validator");
const Tweet = require("../models/tweet");
const fs = require("fs");
const path = require("path");

const pathHelper = require("../util/path");
const { validateImageHelper } = require("../util/validateFile");
const { userRefExist } = require("../util/dbRefCheck");
const { Types } = require("mongoose");

const ITEMS_PER_PAGE = 15;

exports.addTweet = async (req, res, next) => {
  const text = req.body.text;
  const images = req.body.images;
  const user = req.user;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }
    images.forEach((image, index) => {
      validateImageHelper(image, "images[" + index + "]");
    });

    const tweet = new Tweet({
      text: text,
      images: images,
      userRef: user,
    });

    await tweet.save();

    res.status(201).json({ message: "Tweet created.", tweet: tweet });
  } catch (err) {
    next(err);
  }
};

exports.tweets = async (req, res, next) => {
  const userRef = req.user._id;
  const page = +req.query.page || 1;

  const search = req.query.search || "";
 
  try {
    let tweets = await Tweet.aggregate([
      { $match: { text: { $regex: new RegExp(search) } } },

      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
      // {
        // $lookup: {
        //   from: "users",
        //   localField: "userRef",
        //   foreignField: "_id",
        //   as: "userRef",
        // },
      // },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "tweetRef",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "replies",
          localField: "_id",
          foreignField: "tweetRef",
          as: "replies",
        },
      },

      // { $unwind: { path: "$userRef", preserveNullAndEmptyArrays: false } },
      {
        $addFields: {
          liked: {
            $reduce: {
              input: "$likes",
              initialValue: false,
              in: {
                $cond: [{ $eq: ["$$this.userRef", userRef] }, true, "$$value"],
              },
            },
          },
        },
      },
      {
        $project: {
          userRef: 1,
          text: 1,
          createdAt: 1,
          updatedAt: 1,
          images: 1,
          liked: 1,
          __v: 1,

          likesCount: { $size: "$likes" },
          repliesCount: { $size: "$replies" },
        },
      },
    ]);
 
    res.status(200).json({ tweets });
  } catch (err) {
    next(err);
  }
};
exports.userTweets = async (req, res, next) => {
  const userRef = req.user._id;
  const userRefParam = req.params.userRef;
  const page = +req.query.page || 1;

  try {
    let tweets = await Tweet.aggregate([
      { $match: { userRef: Types.ObjectId(userRefParam) } },

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
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "tweetRef",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "replies",
          localField: "_id",
          foreignField: "tweetRef",
          as: "replies",
        },
      },

      // { $unwind: { path: "$userRef", preserveNullAndEmptyArrays: false } },
      {
        $addFields: {
          liked: {
            $reduce: {
              input: "$likes",
              initialValue: false,
              in: {
                $cond: [{ $eq: ["$$this.userRef", userRef] }, true, "$$value"],
              },
            },
          },
        },
      },
      {
        $project: {
          userRef: 1,
          text: 1,
          createdAt: 1,
          updatedAt: 1,
          images: 1,
          liked: 1,
          __v: 1,

          likesCount: { $size: "$likes" },
          repliesCount: { $size: "$replies" },
        },
      },
    ]);
 
    res.status(200).json({ tweets });
  } catch (err) {
    next(err);
  }
};

exports.tweet = async (req, res, next) => {
  const tweetId = req.params.tweetId;
  const userRef = req.user._id;

  try {
    const tweets = await Tweet.aggregate([
      {
        $match: {
          _id: Types.ObjectId(tweetId),
        },
      },
      { $limit: 1 },

      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "userRef",
      //     foreignField: "_id",
      //     as: "userRef",
      //   },
      // },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "tweetRef",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "replies",
          localField: "_id",
          foreignField: "tweetRef",
          as: "replies",
        },
      },

      // { $unwind: { path: "$userRef", preserveNullAndEmptyArrays: false } },
      {
        $addFields: {
          liked: {
            $reduce: {
              input: "$likes",
              initialValue: false,
              in: {
                $cond: [{ $eq: ["$$this.userRef", userRef] }, true, "$$value"],
              },
            },
          },
        },
      },
      {
        $project: {
          userRef: 1,
          text: 1,
          createdAt: 1,
          updatedAt: 1,
          images: 1,
          liked: 1,
          __v: 1,

          likesCount: { $size: "$likes" },
          repliesCount: { $size: "$replies" },
        },
      },
    ]);

    if (!userRefExist(tweets[0], next)) return next();

    res.status(200).json({ tweet: tweets[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteTweet = async (req, res, next) => {
  const tweetId = req.params.tweetId;

  try {
    const tweet = await Tweet.findOneAndDelete({
      _id: tweetId,
      userRef: req.user._id,
    });

    if (!tweet) {
      return next();
    }

    res.status(200).json({ message: "Tweet deleted.", tweetId });
  } catch (err) {
    next(err);
  }
};

exports.updateTweet = async (req, res, next) => {
  const text = req.body.text;
  const images = req.body.images;
  const tweetId = req.params.tweetId;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }
    images.forEach((image, index) => {
      validateImageHelper(image, "images[" + index + "]");
    });

    const tweet = await Tweet.findOne({
      _id: tweetId,
      userRef: req.user._id,
    }).populate("userRef");
    if (!userRefExist(tweet, next)) return next();

    tweet.text = text;
    tweet.images = images;
    await tweet.save();

    res.status(200).json({ message: "Tweet updated", tweet });
  } catch (err) {
    next(err);
  }
};
