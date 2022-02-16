import "./sass/main.scss";
import { Redirect, Route, Switch } from "react-router-dom";
import { FC } from "react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Tweet from "./pages/Tweet";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reset from "./pages/Reset";
import Profile from "./pages/Profile";
import UpdatePassword from "./components/UpdatePassword";

import {  useSelector } from "react-redux";
import {  RootState } from "./store";

 
const App: FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
 
  
  return (
    <> 
 
    <Switch>
      <Route path="/" exact>
        <Redirect to="/home" />
      </Route>

      <Route path="/home" exact>
        <PrivateRoute token={token} auth={true}>
          <MainLayout>
            <Home />
          </MainLayout>
        </PrivateRoute>
      </Route>

      <Route path="/tweet/:id" exact>
        <PrivateRoute token={token} auth={true}>
          <MainLayout>
            {" "}
           <Tweet/>
           
          </MainLayout>{" "}
        </PrivateRoute>
      </Route>
      <Route path="/profile/:id" exact>
        <PrivateRoute token={token} auth={true}>
          <MainLayout>
           <Profile/>
          </MainLayout>
        </PrivateRoute>
      </Route>

      <Route path="/login" exact>
        <PrivateRoute token={token} auth={false}>
          <Login />
        </PrivateRoute>
      </Route>
      <Route path="/signup" exact>
        <PrivateRoute token={token} auth={false}>
          <Signup />
        </PrivateRoute>
      </Route>
      <Route path="/reset" exact>
        <PrivateRoute token={token} auth={false}>
          <Reset />
        </PrivateRoute>
      </Route>
      <Route path="/update-password/:recoveryToken" exact>
        <PrivateRoute token={token} auth={false}>
          <UpdatePassword />
        </PrivateRoute>
      </Route>
      <Route path="*">not found</Route>
    </Switch>
    </>
  );
};

export default App;

const PrivateRoute = ({
  token,
  children,
  auth,
}: {
  token: string | null;
  children: any;
  auth: boolean;
}) => {
  if (auth) return token ? children : <Redirect to="/login" />;

  return !token ? children : <Redirect to="/home" />;
};
