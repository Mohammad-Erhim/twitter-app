import axios from "axios";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, RootState } from "../store";

const Logout: FC = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { user} = useSelector((state: RootState) => state.auth);
 
  const logout = async () => {
    try {
      setLoading(true);
       await axios.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      dispatch(authActions.setToken(null));
      dispatch(authActions.setUser(null));
    } catch (error: any) {
      if (error?.response?.status === 401)
         { dispatch(authActions.setToken(null));dispatch(authActions.setUser(null));
         }
      setLoading(false);
    } finally {
    }
  };
  return (
    <div className="log-out">
      <div className="account">
        <img alt="img" src={`/${user?.avatar}`} className="account__avatar"></img>
        <div className="account-name">
        <span className="account-name--primary">{user?.name}</span>
                <span className="account-name--secondary">{user?.name+''+user?._id.substr(0,5)}</span>
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
