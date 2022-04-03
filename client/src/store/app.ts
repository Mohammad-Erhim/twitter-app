import { createSlice } from "@reduxjs/toolkit";
 
import { Err } from "../util/types";


const initialState: {
    login: { errs: Err[], loading: boolean },
    signup: { errs: Err[], loading: boolean },
    reset: { errs: Err[], loading: boolean },
    logout: { loading: boolean },
    updatePassword: { errs: Err[], loading: boolean },
    homeTweetsData: { loading: boolean },
    search: string,
    reply: { loading: boolean },
    likeAndRemove: { loading: boolean },

} = {
    login: { errs: [], loading: false },
    signup: { errs: [], loading: false },
    reset: { errs: [], loading: false },
    logout: { loading: false },
    updatePassword: { errs: [], loading: false },
    homeTweetsData: { loading: false },
    search: '',
    reply: { loading: false },
    likeAndRemove: { loading: false },
     

};

const appSlice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setLoginLoading(state, action: { payload: boolean }) {
            state.login.loading = action.payload;
        },

        setLoginErrs(state, action: { payload: Err[] }) {
            state.login.errs = action.payload;
        },
        setSignupLoading(state, action: { payload: boolean }) {
            state.signup.loading = action.payload;
        },

        setSignupErrs(state, action: { payload: Err[] }) {
            state.signup.errs = action.payload;
        },
        setResetLoading(state, action: { payload: boolean }) {
            state.reset.loading = action.payload;
        },

        setResetErrs(state, action: { payload: Err[] }) {
            state.reset.errs = action.payload;
        },

        setUpdatePasswordLoading(state, action: { payload: boolean }) {
            state.updatePassword.loading = action.payload;
        },

        setUpdatePasswordErrs(state, action: { payload: Err[] }) {
            state.updatePassword.errs = action.payload;
        },
        setHomeTweetsDataLoading(state, action: { payload: boolean }) {
            state.homeTweetsData.loading = action.payload;
        },
        setSearch(state, action: { payload: string }) {
            state.search = action.payload;
        },
        setLogoutLoading(state, action: { payload: boolean }) {
            state.logout.loading = action.payload;
        },
        setReplyLoading(state, action: { payload: boolean }) {
            state.reply.loading = action.payload;
        },
        setLikeAndRemoveTweetLoading(state, action: { payload: boolean }) {
            state.likeAndRemove.loading = action.payload;
        },

        
         


    },
});

export default appSlice;