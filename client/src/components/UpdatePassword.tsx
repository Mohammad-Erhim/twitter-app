import axios from "axios";
import { FC, useState } from "react";
import { useHistory, useParams } from "react-router";
enum Inputs {
  Name,
  Email,
  Password,
  ConfirmPassword,
}

interface Err {
  location: string;
  msg: string;
  param: string;
  value: string;
}
const UpdatePassword: FC = () => {
  const history = useHistory();
  const {recoveryToken}=useParams<{recoveryToken:string}>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [foucs, setFoucs] = useState<Inputs | null>(null);
  const [errs, setErrs] = useState<Err[]>([]);
  const [loading, setLoading] = useState(false);


  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.post("/password/set/"+recoveryToken, {
        password,
        confirmPassword,
      });
      history.push("/login");
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setErrs(error.response.data.data);
      }
      setLoading(false);
    }
  };
  return (
    <form className="form" onSubmit={onSubmit}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="r-1cvl2hr r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp"
      >
        <g>
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
        </g>
      </svg>
      <span className="title">Update Password </span>
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
      <div
        className={`form__input ${
          foucs === Inputs.ConfirmPassword || confirmPassword ? "focus" : ""
        } ${errs.find((e) => e.param === "confirmPassword")?.param ? "err" : ""}`}
      >
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() => setFoucs(Inputs.ConfirmPassword)}
          onBlur={() => setFoucs(null)}
        ></input>

        <span className="label">Re-Password</span>
        <span className="err">
          {errs.find((e) => e.param === "confirmPassword")?.msg}
        </span>
      </div>
      <button type="submit" className={`btn ${loading ? "disable-btn" : ""}`}>
        Update password
      </button>
    </form>
  );
};
export default UpdatePassword;