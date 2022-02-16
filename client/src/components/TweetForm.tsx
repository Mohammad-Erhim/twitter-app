import axios, { CancelTokenSource } from "axios";
import { FC, memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, dataAction, RootState } from "../store";
import { Tweet } from "../util/ts";

const count = 150;
const TweetForm: FC<{ close?: any }> = ({ close }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState("");
  const ref = useRef<any>();
  const [imgs, setImgs] = useState<
    {
      id: number;
      percentCompleted: number;
      value: File;
      source: CancelTokenSource;
      path?: string;
    }[]
  >([]);

  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let l = 0;
    for (let index = 0; index < imgs.length; index++) {
      l += imgs[index].percentCompleted;
    }

    let v =   l / imgs.length;
    if(v===100)
    v=0;
    setProgress(v);
 
    
  }, [imgs]);

  const onAddImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length !== 1) return;
    setErr("");
    if (imgs.length === 4) {
      setErr("Max count of images are four.");
      return;
    }

    const file = event.target.files[0];
    ref.current.value = "";
    if (file.size > 2000000) {
      setErr("Max size of image is 2mb.");
      return;
    }
    const source = axios.CancelToken.source();
    const id = imgs.length;
    setImgs((prevImgs) => [
      ...prevImgs,
      { id, value: file, source, percentCompleted: 0 },
    ]);

    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("/images", formData, {
        cancelToken: source.token,
        headers: {
          Authorization: "Bearer " + token,
        },
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setImgs((prevImgs) => {
            const imgIndex = prevImgs.findIndex((img) => img.id === id);
            prevImgs[imgIndex].percentCompleted = percentCompleted;
            return [...prevImgs];
          });
        },
      });

      setImgs((prevImgs) => {
        const imgIndex = prevImgs.findIndex((img) => img.id === id);
        prevImgs[imgIndex].path = res.data.path;
        return [...prevImgs];
      });
    } catch (error: any) {
      if (error?.response?.status === 401)
        return dispatch(authActions.setToken(null));
      setImgs((prevImgs) => {
        prevImgs.splice(id, 1);
        return [...prevImgs];
      });
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    let imgsPaths: string[] = [];
    imgs.forEach((img) => {
      if (img.path) imgsPaths.push(img.path);
    });
 
    try {
      const res = await axios.post(
        "/tweets",
        {
          text,
          images: imgsPaths,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setErr("");
      setImgs([]);
      setText("");
      setLoading(false);
      const tweet: Tweet = res.data.tweet;
      tweet.likesCount = 0;
      tweet.repliesCount = 0;
      tweet.userRef = user?._id || "";
      dispatch(dataAction.addTweet({ tweet: tweet }));
      close();
    } catch (error: any) {
   
      if (error?.response?.status === 401) {
        return dispatch(authActions.setToken(null));
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          width: progress===100?0:progress+"vw",
          height: "10px",
          backgroundColor: "blue",
          position: "fixed",
          left: "0",
          top: "0",
          zIndex: 10,
        }}
      ></div>
      <form onSubmit={onSubmit} className="tweet-form init-animation">
        <span className="tweet-form__letter-count">
          {count - text.trim().length + "/" + count}
        </span>
        <div className="tweet-form__body">
          <img alt="avatar"  src={`${
              user?.avatar
                ? "/" + user?.avatar
                : "/profile.png"
            }`}></img>
          <textarea
            value={text}
            onChange={(e) => {
              setText((prev) =>
                count - e.target.value.trim().length > -1
                  ? e.target.value
                  : prev
              );
            }}
            placeholder="What's happening?"
          ></textarea>
        </div>{" "}
        <Imgs imgs={imgs} />
        <div className="tweet-form__footer">
          <div className="buttons-list">
            <div className="icon-with-cycle">
              <input
                ref={ref}
                type="file"
                accept=".jpg,.png"
                onChange={onAddImg}
              />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z"></path>
                  <circle cx="8.868" cy="8.309" r="1.542"></circle>
                </g>
              </svg>
            </div>
            <button className="icon-with-cycle">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M19 10.5V8.8h-4.4v6.4h1.7v-2h2v-1.7h-2v-1H19zm-7.3-1.7h1.7v6.4h-1.7V8.8zm-3.6 1.6c.4 0 .9.2 1.2.5l1.2-1C9.9 9.2 9 8.8 8.1 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1.1v-2.5H7.7v1.2h1.2v.6c-.2.1-.5.2-.8.2-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.6 1.6-1.6z"></path>
                  <path d="M20.5 2.02h-17c-1.24 0-2.25 1.007-2.25 2.247v15.507c0 1.238 1.01 2.246 2.25 2.246h17c1.24 0 2.25-1.008 2.25-2.246V4.267c0-1.24-1.01-2.247-2.25-2.247zm.75 17.754c0 .41-.336.746-.75.746h-17c-.414 0-.75-.336-.75-.746V4.267c0-.412.336-.747.75-.747h17c.414 0 .75.335.75.747v15.507z"></path>
                </g>
              </svg>
            </button>
            <button className="icon-with-cycle">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-1cvl2hr r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
              >
                <g>
                  <path d="M20.222 9.16h-1.334c.015-.09.028-.182.028-.277V6.57c0-.98-.797-1.777-1.778-1.777H3.5V3.358c0-.414-.336-.75-.75-.75s-.75.336-.75.75V20.83c0 .415.336.75.75.75s.75-.335.75-.75v-1.434h10.556c.98 0 1.778-.797 1.778-1.777v-2.313c0-.095-.014-.187-.028-.278h4.417c.98 0 1.778-.798 1.778-1.778v-2.31c0-.983-.797-1.78-1.778-1.78zM17.14 6.293c.152 0 .277.124.277.277v2.31c0 .154-.125.28-.278.28H3.5V6.29h13.64zm-2.807 9.014v2.312c0 .153-.125.277-.278.277H3.5v-2.868h10.556c.153 0 .277.126.277.28zM20.5 13.25c0 .153-.125.277-.278.277H3.5V10.66h16.722c.153 0 .278.124.278.277v2.313z"></path>
                </g>
              </svg>
            </button>

            <button className="icon-with-cycle">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path>
                  <path d="M12 17.115c-1.892 0-3.633-.95-4.656-2.544-.224-.348-.123-.81.226-1.035.348-.226.812-.124 1.036.226.747 1.162 2.016 1.855 3.395 1.855s2.648-.693 3.396-1.854c.224-.35.688-.45 1.036-.225.35.224.45.688.226 1.036-1.025 1.594-2.766 2.545-4.658 2.545z"></path>
                  <circle cx="14.738" cy="9.458" r="1.478"></circle>
                  <circle cx="9.262" cy="9.458" r="1.478"></circle>
                </g>
              </svg>
            </button>
            <button className="icon-with-cycle">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2z"></path>
                  <path d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2zM18 2.2h-1.3v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H7.7v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H4.8c-1.4 0-2.5 1.1-2.5 2.5v13.1c0 1.4 1.1 2.5 2.5 2.5h2.9c.4 0 .8-.3.8-.8 0-.4-.3-.8-.8-.8H4.8c-.6 0-1-.5-1-1V7.9c0-.3.4-.7 1-.7H18c.6 0 1 .4 1 .7v1.8c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-5c-.1-1.4-1.2-2.5-2.6-2.5zm1 3.7c-.3-.1-.7-.2-1-.2H4.8c-.4 0-.7.1-1 .2V4.7c0-.6.5-1 1-1h1.3v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5h7.5v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5H18c.6 0 1 .5 1 1v1.2z"></path>
                  <path d="M15.5 10.4c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2 3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2zm0 11c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7c0 2.5-2.1 4.7-4.7 4.7z"></path>
                  <path d="M18.9 18.7c-.1.2-.4.4-.6.4-.1 0-.3 0-.4-.1l-3.1-2v-3c0-.4.3-.8.8-.8.4 0 .8.3.8.8v2.2l2.4 1.5c.2.2.3.6.1 1z"></path>
                </g>
              </svg>
            </button>
          </div>
          <button
            className={`btn ${
              
              loading ||
              !text.trim() ||
              imgs.find((img) => img.percentCompleted !== 100)
                ? "disable-btn"
                : ""
            }`}
          >
            Tweet
          </button>
        </div>
        <span className="err">{err}</span>
      </form>
    </>
  );
};

export default TweetForm;

const Imgs: FC<{
  imgs: {
    percentCompleted?: number;
    value: File;
    source: CancelTokenSource;
    path?: string;
  }[];
}> = memo(({ imgs }) => {
  if (!imgs.length) return null;

  return (
    <>
      <div className="tweet-imgs">
        {imgs.length === 1 && (
          <img alt="img" src={URL.createObjectURL(imgs[0].value)}></img>
        )}
        {imgs.length === 2 && (
          <>
            <img alt="img"
              className="img-r1-c1-t2"
              src={URL.createObjectURL(imgs[0].value)}
            ></img>
            <img alt="img"
              className="img-r1-c2-t2"
              src={URL.createObjectURL(imgs[1].value)}
            ></img>
          </>
        )}
        {imgs.length === 3 && (
          <>
            <img alt="img"
              className="img-r1-c1-t3"
              src={URL.createObjectURL(imgs[0].value)}
            ></img>
            <img alt="img"
              className="img-r1-c2-t3"
              src={URL.createObjectURL(imgs[1].value)}
            ></img>
            <img alt="img"
              className="img-r2-t3"
              src={URL.createObjectURL(imgs[2].value)}
            ></img>
          </>
        )}
        {imgs.length === 4 && (
          <>
            <img alt="img"
              className="img-r1-c1-t4"
              src={URL.createObjectURL(imgs[0].value)}
            ></img>

            <img alt="img"
              className="img-r1-c2-t4"
              src={URL.createObjectURL(imgs[1].value)}
            ></img>
            <img alt="img"
              className="img-r2-c1-t4"
              src={URL.createObjectURL(imgs[2].value)}
            ></img>
            <img alt="img"
              className="img-r2-c2-t4"
              src={URL.createObjectURL(imgs[3].value)}
            ></img>
          </>
        )}
      </div>
    </>
  );
});
