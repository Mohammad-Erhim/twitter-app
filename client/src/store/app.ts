import {  createSlice } from "@reduxjs/toolkit";
 
 
const initialState:{search:string} = {
  search:''
};

 const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setSearch(state, action:{payload:{search:string}}) {
      state.search = action.payload.search;
    },
    
  },
});
 
export default appSlice;