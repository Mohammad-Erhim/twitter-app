import { createSlice } from "@reduxjs/toolkit";
import { Reply, Tweet, User } from "../util/types";



const initialState: { tweets: Tweet[], users: User[], replies: Reply[] } = {
  replies: [],
  tweets: [],
  users: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState: initialState,
  reducers: {
    addTweet(state, action: { payload:  Tweet  }) {
      state.tweets = filteredArr([action.payload, ...state.tweets]);
    },
    incReply(state, action: { payload: { tweetId: string } }) {
      state.tweets = state.tweets.filter(tweet => {
        if (tweet._id === action.payload.tweetId) {

          tweet.repliesCount = ++tweet.repliesCount;
        }
        return tweet;

      });
    },
    decReply(state, action: { payload: { tweetId: string } }) {
      state.tweets = state.tweets.filter(tweet => {
        if (tweet._id === action.payload.tweetId) {

          tweet.repliesCount = --tweet.repliesCount;
        }
        return tweet;

      });
    },
    addTweets(state, action: { payload:  Tweet[]  }) {
      state.tweets = filteredArr([...state.tweets, ...action.payload]);
    },
    like(state, action: { payload: { tweetId: string } }) {
      state.tweets = state.tweets.filter(tweet => {
        if (tweet._id === action.payload.tweetId) {
          tweet.liked = true;
          tweet.likesCount = ++tweet.likesCount;
        }
        return tweet;

      });
    },
    disLike(state, action: { payload: { tweetId: string } }) {

      state.tweets = state.tweets.filter(tweet => {
        if (tweet._id === action.payload.tweetId) {
          tweet.liked = false;
          tweet.likesCount = --tweet.likesCount;


        }
        return tweet;

      });
    }, addReply(state, action: { payload:  Reply  }) {


      state.replies = [action.payload, ...state.replies];

    },
    addReplies(state, action: { payload: { replies: Reply[] } }) {

      state.replies = filteredArr([...state.replies, ...action.payload.replies]);
    },

    deleteTweet(state, action: { payload: { tweetId: string } }) {

      state.tweets = state.tweets.filter(tweet => {
        if (tweet._id !== action.payload.tweetId)
          return tweet;
        return undefined
      });
    },

    deleteReply(state, action: { payload: { replyId: string } }) {

      state.replies = state.replies.filter(reply => {
        if (reply._id !== action.payload.replyId)
          return reply;
        return undefined;
      });
    },
    addUser(state, action: { payload: { user: User } }) {
      state.users = filteredArr([action.payload.user, ...state.users]);
    },
    addUsers(state, action: { payload:  User[]  }) {
      state.users = filteredArr([...state.users, ...action.payload]);
    },
    updateUser(state, action: { payload: User  }) {

      state.users = filteredArr([...state.users, action.payload]);
    },

  },


});

export default dataSlice;

const filteredArr = (arr: any[], key: any = (it: any) => it._id) => {
  return [...new Map(arr.map((x) => [key(x), x])).values()];
};