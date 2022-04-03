import {  createSlice } from "@reduxjs/toolkit";
import { User } from "../util/types";

const initialState:{user:User|null,token:string|null} = {
  user: null,
  token: null,
};

 const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser(state, action:{payload:User|null}) {
      state.user = action.payload;
    },
    setToken(state, action:{payload:string|null}) {
      state.token = action.payload;
     
    },
  },
});
 
export default authSlice;