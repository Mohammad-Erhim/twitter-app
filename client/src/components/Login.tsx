import axios from "axios";
import { FC, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { appActions, RootState } from "../store";
import { loginAction } from "../store/customActions/loginAction";
import { Inputs } from "../util/types";

const Login: FC = () => {
  const source = axios.CancelToken.source();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [foucs, setFoucs] = useState<Inputs | null>(null);

  const { errs, loading } = useSelector((state: RootState) => state.app.login);

  useEffect(() => {
    return () => {
      source.cancel("Cancelling in cleanup");
      dispatch(appActions.setLoginErrs([]));
    };
    // eslint-disable-next-line
  }, [dispatch]);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(loginAction(email, password, source));
  };

  return (
    <form onSubmit={onSubmit} className="form init-animation">
      <img alt="twitter" width={100} src="/twitter.gif" />
      <span className="title">Login in </span>
      <div
        className={`form__input ${
          foucs === Inputs.Email || email ? "focus" : ""
        } ${errs.find((e) => e.param === "email")?.param ? "err" : ""}`}
      >
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFoucs(Inputs.Email)}
          onBlur={() => setFoucs(null)}
        ></input>

        <span className="label">Email</span>
        <span className="err">
          {errs.find((e) => e.param === "email")?.msg}
        </span>
      </div>{" "}
      <div
        className={`form__input ${
          foucs === Inputs.Password || password ? "focus" : ""
        } ${errs.find((e) => e.param === "password")?.param ? "err" : ""}`}
      >
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFoucs(Inputs.Password)}
          onBlur={() => setFoucs(null)}
        ></input>
        <span className="label">Password</span>
        <span className="err">
          {errs.find((e) => e.param === "password")?.msg}
        </span>
      </div>{" "}
      <button type="submit" className={`btn ${loading ? "disable-btn" : ""}`}>
        Login
      </button>
      <Link className="link" to="/reset">
        Did you forget your password?
      </Link>
      <Link className="link" to="/signup">
        If you have not account signup
      </Link>
    </form>
  );
};
export default Login;
