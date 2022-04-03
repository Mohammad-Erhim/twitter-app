import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, dataActions, RootState } from "../store";
import { Reply } from "../util/types";

import { timeDifference } from "./Tweet";
import { OutsideAlerter } from "./VNav";

const ReplyC: FC<{ reply: Reply }> = ({ reply }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const profile = useSelector((state: RootState) =>
    state.data.users.find((user) => user._id === reply.userRef)
  );
  const [popUpMore, setPopUpMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (!profile) {
        const res = await axios.get("/users/" + reply.userRef, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        dispatch(dataActions.addUser({ user: res.data.user }));
      }
    })();
  }, [dispatch, profile, reply.userRef, token]);

  const remove = async (id: string) => {
    try {
      await axios.delete(
        "/replies/" + id,

        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      dispatch(dataActions.deleteReply({ replyId: id }));
      dispatch(dataActions.decReply({ tweetId: reply.tweetRef }));
    } catch (error: any) {
      if (error.response?.status === 401) dispatch(authActions.setToken(null));
      setLoading(false);
    }
  };

  return (
    <div className="reply">
      <div className="reply__header">
        <div className="account">
          <img
            alt="img"
            className="account__avatar"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "/profile.png";
            }}
            src={`${profile?.avatar ? "/" + profile?.avatar : "/profile.png"}`}
          ></img>
          <div className="account-name">
            <span className="account-name--primary">{profile?.name}</span>
            <span className="account-name--secondary">
              {profile?.name + "" + profile?._id.substr(0, 5)}
            </span>
          </div>
        </div>
        {profile?._id === user?._id && (
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
                  <button
                    onClick={(e) => remove(reply._id)}
                    className="more__delete"
                  >
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

      <div className="reply__content">
        <span className="reply-text">{reply.text}</span>
        <span className="reply-time">{timeDifference(reply.createdAt)}</span>
      </div>
    </div>
  );
};

export default ReplyC;
