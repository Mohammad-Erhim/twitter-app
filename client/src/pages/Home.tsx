import { FC, useEffect, useState } from "react";

import TweetForm from "../components/TweetForm";
import Tweet from "../components/Tweet";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions, dataAction, RootState } from "../store";
 
import Spinner from "../components/Spinner";
let page = 1;

const Home: FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const search = useSelector((state: RootState) => state.app.search);
  const tweets = useSelector((state: RootState) =>
    state.data.tweets.filter((tweet) => tweet.text.includes(search))
  );

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(0);

 

  const dispatch = useDispatch();

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


  useEffect(()=>{
 page = 1;
  },[search])

  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
   let prevent=false;
    (async () => {
      if(prevent)return
      prevent=true;

      setLoading(true);
      try {
        const res = await axios.get(
          "/tweets?page=" + page + "&search=" + search,
          {
            headers: {
              Authorization: "Bearer " + token,
            },

            cancelToken: source.token,
          }
        );

        ++page;
        
        dispatch(dataAction.addTweets({ tweets: res.data.tweets }));
        if (!unmounted) {
          setLoading(false);
        }
        prevent=false;
      } catch (error: any) {
        if (error?.response?.status === 401)
          dispatch(authActions.setToken(null));

        if (!unmounted) {
          setLoading(false);

          setLoading(false);
        }
        prevent=false;
      }
    })();
    return () => {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, [search,update,dispatch,token]);

  return (
    <>
      <TweetForm />
      <div id="scroll">
        {tweets.map((tweet) => (
          <Tweet key={tweet._id} tweet={tweet} />
        ))}
        <div>{<Spinner loading={loading} />}</div>
      </div>
    </>
  );
};

export default Home;
