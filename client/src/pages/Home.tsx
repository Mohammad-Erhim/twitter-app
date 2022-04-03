import { FC, useEffect, useState } from "react";

import TweetForm from "../components/TweetForm";
import Tweet from "../components/Tweet";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

import Spinner from "../components/Spinner";
import { getTweets } from "../store/customActions/getTweetsAction";
import { searchTweets } from "../store/customActions/searchTweetsAction";
let page = 1;

const Home: FC = () => {
  const search = useSelector((state: RootState) => state.app.search);
  const tweets = useSelector((state: RootState) =>
    state.data.tweets.filter((tweet) => tweet.text.includes(search))
  );
  const loading = useSelector(
    (state: RootState) => state.app.homeTweetsData.loading
  );

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

  useEffect(() => {
    let source = axios.CancelToken.source();
    dispatch(searchTweets(page, search, source));
    page = 1;

    return () => {
      source.cancel("Cancelling in cleanup");
    };
  }, [search, dispatch]);

  useEffect(() => {
    let source = axios.CancelToken.source();
    dispatch(getTweets(page, source));
    ++page;
  }, [update, dispatch]);

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
