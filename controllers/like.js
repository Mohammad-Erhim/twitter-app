const Like = require("../models/like");

exports.addLike = async (req, res, next) => {
  const tweetRef = req.params.tweetRef;

  try {
    const like = await Like.findOneAndUpdate(
      { userRef: req.user._id, tweetRef },
      { userRef: req.user._id, tweetRef },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Like created.", like });
  } catch (err) {
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  const tweetRef = req.params.tweetRef;
  try {
    const like = await Like.findOneAndDelete(
      { userRef: req.user._id, tweetRef }
    
    );
    if (!like) return next();
    res.status(200).json({ message: "Like deleted.", like });
  } catch (err) {
    next(err);
  }
};
