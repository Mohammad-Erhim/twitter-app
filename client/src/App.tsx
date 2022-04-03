import "./sass/main.scss";
import { Redirect, Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import Signup from "./pages/Signup";
import Reset from "./pages/Reset";
import UpdatePassword from "./pages/UpdatePassword";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Profile from "./pages/Profile";
import Tweet from "./pages/Tweet";

const App = () => {
  const token = useSelector((state: RootState) => state.auth).token;

  return (
    <>
      {token ? (
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home" />
          </Route>

          <Route path="/home" exact>
            <MainLayout>
              <Home />
            </MainLayout>
          </Route>

          <Route path="/tweet/:id" exact>
          <MainLayout>
            <Tweet/></MainLayout>
          </Route>
          <Route path="/profile/:id" exact>
          <MainLayout>
            <Profile/></MainLayout>
          </Route>

          <Route path="*">
            <Redirect to="/home" />
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/signup" exact>
            <Signup />
          </Route>
          <Route path="/reset" exact>
            <Reset />
          </Route>
          <Route path="/update-password/:recoveryToken" exact>
            <UpdatePassword />
          </Route>
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      )}
    </>
  );
};

export default App;
