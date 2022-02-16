require('dotenv').config()
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const schedule = require("node-schedule");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const tweetRoutes = require("./routes/tweet");
const imageRoutes = require("./routes/image");
const replyRoutes = require("./routes/reply");

const likeRoutes = require("./routes/like");

const { removeUnSubmitedFiles } = require("./util/scheduling");
 const MONGODB_URI =process.env.MONGODB_URI ;
 //mongodb://localhost:27017/twitter

// const rule = new schedule.RecurrenceRule();
// rule.second = 0;
// // rule.hour = 1;
// schedule.scheduleJob(rule, removeUnSubmitedFiles);
const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(authRoutes);
app.use(userRoutes);
app.use(tweetRoutes);
app.use(replyRoutes);
app.use(imageRoutes);
app.use(likeRoutes);
app.use(function (req, res, next) {
  res.status(404).json({ message: "Not found." });
});
app.use(function (error, req, res, next) { 
  console.log(error);
  if (!error.statusCode) {
    error.statusCode = 500;
    error.message = "Server error.";
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    error.statusCode = 400;
    error.message = "Max size for file must be at most 2mb.";
  
  }
  const status = error.statusCode;
  const message = error.message;
  
  res.status(status).json({ message: message, data: error.data });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(8000);
  })
  .catch((err) => {

    console.log(err);
  });

  