import axios, { CancelTokenSource } from "axios";
import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, dataAction, RootState } from "../store";

const HeaderForm: FC<{ close: () => void }> = ({ close }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const refA = useRef<any>();
  const refC = useRef<any>();
  const [err, setErr] = useState("");
  const [avatar, setAvatar] = useState<{
    percentCompleted: number;
    value: File;
    source: CancelTokenSource;
    path?: string;
  }>();
  const [cover, setCover] = useState<{
    percentCompleted: number;
    value: File;
    source: CancelTokenSource;
    path?: string;
  }>();

  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const [loading,setLoading]=useState(false);
  const [progress,setProgress]=useState(0);
  
  useEffect(() => 
  {

    let filesCount=cover?.value&&avatar?.value?2:1;

    if (
      ((cover?.percentCompleted || 0) + (avatar?.percentCompleted || 0)) / filesCount ===
      100
    )
    
     setProgress(0);
    else
      setProgress(
          ((cover?.percentCompleted || 0) + (avatar?.percentCompleted || 0)) / filesCount
        
      );
  }, [cover, avatar]);
  const onChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length !== 1) return;
    
    if (avatar?.source) avatar.source.cancel();
    setErr("");

    const file = event.target.files[0];

    if (file.size > 2000000) {
      setErr("Max size of image is 2mb.");
      return;
    }
    const source = axios.CancelToken.source();

    const formData = new FormData();
    formData.append("image", file);
    try {
      setLoading(true)
      const res = await axios.post("/images", formData, {
        cancelToken: source.token,
        headers: {
          Authorization: "Bearer " + token,
        },
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setAvatar({ value: file, source, percentCompleted });
        },
      });

      setAvatar((prev: any) => {
        return {
          ...prev,
          path: res.data.path,
        };
      });
      setLoading(false);
    } catch (error: any) {
      if (error?.response?.status === 401)
        return dispatch(authActions.setToken(null));
      setAvatar(undefined);
      setLoading(false);
    }
  };
  const onChangeCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length !== 1) return;
    if (cover?.source) cover.source.cancel();
    setErr("");

    const file = event.target.files[0];

    if (file.size > 2000000) {
      setErr("Max size of image is 2mb.");
      return;
    }
    const source = axios.CancelToken.source();

    const formData = new FormData();
    formData.append("image", file);
    try {
      setLoading(true)
      const res = await axios.post("/images", formData, {
        cancelToken: source.token,
        headers: {
          Authorization: "Bearer " + token,
        },
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setCover({ value: file, source, percentCompleted });
        },
      });

      setCover((prev: any) => {
        return {
          ...prev,
          path: res.data.path,
        };
      });
      setLoading(false);
    } catch (error: any) {
 
      
      if (error?.response?.status === 401)
        return dispatch(authActions.setToken(null));
      setCover(undefined);
      setLoading(false);
    }
  };
  const onSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);
 
    try {
      const res = await axios.patch(
        "/me",
        {
          avatar:avatar?.path||user?.avatar,
          cover:cover?.path||user?.cover
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setErr("");
 
      setLoading(false);
 
      dispatch(authActions.setUser(res.data.user));
      dispatch(dataAction.updateUser({user:res.data.user}));
      close();
    } catch (error: any) {
   

      if (error?.response?.status === 401) {
        return dispatch(authActions.setToken(null));
      }
      setLoading(false);
    }
  };

  return (
    <>    <div
    style={{
      width: progress+"%",
      height: "10px",
      backgroundColor: "blue",
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 10,
    }}
  ></div>
      <form onSubmit={onSubmit} className="profile-header-form">
        <svg
          viewBox="0 0 24 24"
          aria-label="Twitter"
          className="r-1cvl2hr r-4qtqp9 r-yyyyoo r-16y2uox r-lwhw9o r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
        >
          <g>
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
          </g>
        </svg>
        <div className="header-view">
          <div style={{ position: "relative" }}>
            <input
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: "0",
              }}
              ref={refA}
              type="file"
              accept=".jpg,.png"
              onChange={onChangeCover}
            />

            <img
            alt="img"
              src={cover?.value?URL.createObjectURL(cover?.value):`/${user?.cover}`}
              className="header-view__cover"
            ></img>
          </div>
          <div className="header-view__account">
            <div style={{ position: "relative",    borderRadius: '100%',
    display: 'flex' }}>
              <input
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: "0",
                }}
                ref={refC}
                type="file"
                accept=".jpg,.png"
                onChange={onChangeAvatar}
              />

              <img
                alt="img"
                className="account-avatar"
                src={avatar?.value?URL.createObjectURL(avatar?.value):`/${user?.avatar}`}
              ></img>
            </div>{" "}
            <div className="account-name">
              <span className="account-name--primary">{user?.name}</span>
              <span className="account-name--secondary">
                {user?.name + "" + user?.name.slice(0, 5)}
              </span>
            </div>
          </div>
          <button
            className={`btn ${
              progress ||
              loading 
             
                ? "disable-btn"
                : ""
            }`}
          type='submit' >Submit</button>
        </div>
        
      </form>
      <div className="empty-6"></div><span className="err">{err}</span>
    </>
  );
};

export default HeaderForm;
