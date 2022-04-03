import axios from "axios";
import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import PopUpLayout from "../layouts/PopUpLayout";
import {   RootState } from "../store";
import { getUserAction } from "../store/customActions/getUserAction";
import { disLikeAction, likeAction } from "../store/customActions/likeActions";
import { removeTweetAction } from "../store/customActions/removeTweetAction";
import { Tweet } from "../util/types";
 
import ReplyForm from "./ReplyForm";
import { OutsideAlerter } from "./VNav";
 
const TweetC: FC<{ tweet: Tweet }> = ({ tweet }) => {
  const source = axios.CancelToken.source();

  const { user } = useSelector((state: RootState) => state.auth);
  const profile = useSelector((state: RootState) => state.data.users.find(user=>user._id===tweet.userRef));
 
  const [loading,setLoading]=useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
 
  const [popUpReplyForm, setPopUpReplyForm] = useState(false);
  const [popUpMore, setPopUpMore] = useState(false);

  useEffect(()=>{
   
    
      if (!profile) 
        dispatch(getUserAction(tweet._id,source));
    
        return () => {
          source.cancel("Cancelling in cleanup");
          
        };
        // eslint-disable-next-line 
  },[])
 
  const like = async () => {
     dispatch(likeAction(tweet._id,source,()=>setLoading(true),()=>{setLoading(false)}));
  };
  const disLike = async () => {
    dispatch(disLikeAction(tweet._id,source,()=>setLoading(true),()=>{setLoading(false)}));
 }; 
  const remove = async () => {
  dispatch(removeTweetAction(tweet._id,source,()=>setLoading(true),()=>{setLoading(false)}));
  };
  
 
  return (
    <div
      className="tweet init-animation"
      onClick={() =>
        history.location.pathname !== "/tweet/" + tweet._id &&
        history.push("/tweet/" + tweet._id)
      }
    >
      <div className="tweet__header">
 
        <Link onClick={e=> e.stopPropagation()} className="account" to={`/profile/${tweet.userRef}`}>
          <img alt="img"
            className="account__avatar"
            src={`${
              profile?.avatar
                ? "/" + profile?.avatar
                : "/profile.png"
            }`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src="/profile.png";
            }}
          ></img>
          <div className="account-name">
            <span className="account-name--primary">{profile?.name}</span>
            <span className="account-name--secondary">@{profile?.name}12321726</span>
          </div>
        
</Link>
        {tweet.userRef === user?._id && (
          <OutsideAlerter reSetToggle={() => setPopUpMore(false)}>
            {" "}
            <div style={{ position: "relative" }}>
              {popUpMore && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`more ${loading ? "disable-btn" : ""}`}
                  style={{ position: "absolute", right: "3rem" }}
                >
                  <button className="more__edit">Edit</button>{" "}
                  <button onClick={remove} className={`more__delete ${loading ? "disable-btn" : ""}`}>
                    Delete
                  </button>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPopUpMore((prev) => !prev);
                }}
                className="icon-with-cycle"
              >
                <svg viewBox="0 0 24 24">
                  <g>
                    <circle cx="5" cy="12" r="2"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                    <circle cx="19" cy="12" r="2"></circle>
                  </g>
                </svg>
              </button>
            </div>
          </OutsideAlerter>
        )}
      </div>

      <div className="tweet__content">
        <span className="tweet-text">{tweet.text}</span>
        {tweet.images.length > 0 && (
          <div className="tweet-imgs">
            {tweet.images.length === 1 && (
              <img alt="img" src={`/${tweet.images[0]}`} 
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src="/profile.png";
              }}
              ></img>
            )}
            {tweet.images.length === 2 && (
              <>
                <img
                alt="img"
                  className="img-r1-c1-t2"
                  src={`/${tweet.images[0]}`}
                ></img>
                <img
                alt="img"
                  className="img-r1-c2-t2"
                  src={`/${tweet.images[1]}`}
                ></img>
              </>
            )}
            {tweet.images.length === 3 && (
              <>
                <img
                alt="img"
                  className="img-r1-c1-t3"
                  src={`/${tweet.images[0]}`}
                ></img>
                <img
                alt="img"
                  className="img-r1-c2-t3"
                  src={`/${tweet.images[1]}`}
                ></img>
                <img
                alt="img"
                  className="img-r2-t3"
                  src={`/${tweet.images[2]}`}
                ></img>
              </>
            )}
            {tweet.images.length === 4 && (
              <>
                <img
                alt="img"
                  className="img-r1-c1-t4"
                  src={`/${tweet.images[0]}`}
                ></img>

                <img
                alt="img"
                  className="img-r1-c2-t4"
                  src={`/${tweet.images[1]}`}
                ></img>
                <img
                alt="img"
                  className="img-r2-c1-t4"
                  src={`/${tweet.images[2]}`}
                ></img>
                <img
                alt="img"
                  className="img-r2-c2-t4"
                  src={`/${tweet.images[3]}`}
                ></img>
              </>
            )}
          </div>
        )}
        <span className="tweet-time"> {timeDifference(tweet.createdAt)}</span>
      </div>
      <div className="tweet__footer">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPopUpReplyForm(true);
          }}
          className="icon-with-cycle"
        >
          <span className="count">{tweet.repliesCount}</span>
          <svg viewBox="0 0 24 24">
            <g>
              <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
            </g>
          </svg>
        </button>
        {popUpReplyForm &&
          createPortal(
            <div onClick={(e) => e.stopPropagation()}>
              <PopUpLayout
                close={() => {
                  setPopUpReplyForm(false);
                }}
              >
                <ReplyForm
                  tweetId={tweet._id}
                  close={() => setPopUpReplyForm(false)}
                />
              </PopUpLayout>
            </div>,
            document.getElementById("pop-up")!
          )}

        <button className="icon-with-cycle">
          <svg viewBox="0 0 24 24">
            <g>
              <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
            </g>
          </svg>
        </button>
        <button
          onClick={(e) => {
            tweet.liked ? disLike() : like();
            e.stopPropagation();
          }}
          className={`icon-with-cycle red-icon ${loading ? "disable-btn" : ""}`}
        >
          {" "}
          <span
            style={{ color: `${tweet.liked ? "red" : ""}` }}
            className="count"
          >
            {tweet.likesCount}
          </span>
          <svg
            style={{ fill: `${tweet.liked ? "red" : ""}` }}
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
            </g>
          </svg>
        </button>
        <button className="icon-with-cycle">
          <svg viewBox="0 0 24 24">
            <g>
              <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path>
              <path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TweetC;

export function timeDifference(previous: string) {
  let previousDate: any = new Date(previous);
  let current: any = new Date();
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previousDate;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}
