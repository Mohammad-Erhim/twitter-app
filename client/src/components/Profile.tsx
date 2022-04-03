import { FC, useEffect, useState } from "react";
 
import Tweet from "../components/Tweet";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions, dataActions, RootState } from "../store";
 
import Spinner from "../components/Spinner";
import ProfileHeader from "../components/ProfileHeader";
import { useParams } from "react-router";

let wait = false;
let page =1;
const Profile: FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id: string }>();
  const profile = useSelector((state: RootState) => state.data).users.find(
    (user) => user._id === id
  );

  const tweets = useSelector((state: RootState) => state.data).tweets.filter(
    (tweet) => tweet.userRef === id
  );
  const [update, setUpdate] = useState(0);

 
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
   // eslint-disable-next-line
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
    window.scrollTo(0, 0);
    page=1;
    (async () => {   
      if (!profile) {
        const res = await axios.get("/users/" + id, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        dispatch(dataActions.addUser({ user: res.data.user }));
      }
    
    })();
 
 
 
  }, [id,dispatch,profile,token]);
  useEffect(()=>{
    if (wait) return;
    wait = true;
    setLoading(true);
   (async()=> {try {
      const res = await axios.get(
        "/users/" + id + "/tweets?page=" + page,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      
      page++;
      dispatch(dataActions.addTweets( res.data.tweets  ));
      setLoading(false);
      wait = false;
    } catch (error: any) {
      if (error?.response?.status === 401) dispatch(authActions.setToken(null));
      setLoading(false);
      wait = false;
    }})()
  },[dispatch,id,token,update])

  return (
    <div id="scroll">
   
      {profile && <ProfileHeader profile={profile} />}
      <div style={{ paddingBottom: "2rem" }}>
        {tweets.map((tweet) => (
          <Tweet key={tweet._id} tweet={tweet} />
        ))}
        <div>{<Spinner loading={loading} />}</div>
      </div>
    </div>
  );
};

export default Profile;
