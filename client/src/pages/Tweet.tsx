import { FC, useEffect, useState } from "react";

import Tweet from "../components/Tweet";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions, dataActions, RootState } from "../store";
import { useParams } from "react-router";
import Reply from "../components/Reply";
 
import Spinner from "../components/Spinner";
let page = 1;

const TweetC :FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id: string }>();
  const tweet = useSelector((state: RootState) => state.data).tweets.find(
    (tweet) => tweet._id === id
  );
  const replies = useSelector((state: RootState) => state.data).replies.filter(
    (reply) => reply.tweetRef === id
  );
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const [update, setUpdate] = useState(0);

   useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/tweets/" + id, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        dispatch(dataActions.addTweet( res.data.tweet ));
      } catch (error: any) {
        if (error?.response?.status === 401)
          dispatch(authActions.setToken(null));
      }
    })();
page=1;
  
  }, [id,dispatch,token]);
  useEffect(()=>{
    (async()=>{
      setLoading(true)
      try {
        const res = await axios.get(
          "/tweets/" + id + "/replies?page=" + page++,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
  
        dispatch(dataActions.addReplies({ replies: res.data.replies }));
        setLoading(false);
     
      } catch (error: any) {
        if (error?.response?.status === 401) dispatch(authActions.setToken(null));
      }
    })()
  },[dispatch,id,token,update])
  const isBottom = (el: HTMLElement | null): boolean => {
    const bottom: number | undefined = el?.getBoundingClientRect()?.bottom;
    if (bottom === undefined) return false;
    return bottom - window.innerHeight < 1;
  };
// eslint-disable-next-line 
  const trackScrolling = () => {
    const wrappedElement: HTMLElement | null =
      document.getElementById("scroll");
    if (isBottom(wrappedElement)) {
      setUpdate(Math.random());
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", trackScrolling);
    return () => document.removeEventListener("scroll", trackScrolling);
  }, [trackScrolling]);

 
 
  return (
   
        <div id="scroll">  
      {tweet && <Tweet tweet={tweet} />}

      
      
   
        {replies.map((reply) => (
          <Reply key={reply._id} reply={reply} />
        ))}
     <div>{<Spinner loading={loading} />}</div>
   </div>
 
  
  );
};
export default TweetC;
