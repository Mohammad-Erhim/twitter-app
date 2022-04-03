import axios from "axios";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { logoutAction } from "../store/customActions/logoutAction";

const Logout: FC = () => {
  const source = axios.CancelToken.source();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const loading = useSelector((state: RootState) => state.app.logout).loading;

  const logout = () => {
    dispatch(logoutAction(source));
  };
  useEffect(() => {
    return () => {
      source.cancel("Cancelling in cleanup");
    };
    // eslint-disable-next-line 
  }, [dispatch]);
  return (
    <div className="log-out">
      <div className="account">
        <img
          alt="img"
          src={`/${user?.avatar}`}
          className="account__avatar"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src="/profile.png";
          }}
        ></img>
        <div className="account-name">
          <span className="account-name--primary">{user?.name}</span>
          <span className="account-name--secondary">
            {user?.name + "" + user?._id.substr(0, 5)}
          </span>
        </div>
      </div>

      <button
        onClick={logout}
        className={`log-out__btn ${loading ? "disable-btn" : ""}`}
      >
        Log out @Therock12321726
      </button>
    </div>
  );
};

export default Logout;
