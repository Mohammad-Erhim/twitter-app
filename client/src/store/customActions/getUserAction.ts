import axios, { CancelTokenSource } from "axios";
import { Dispatch } from "react";
import store, { authActions, dataActions } from "..";


export const getUserAction = (userRef: string, source: CancelTokenSource,) => {
    return async (dispatch: Dispatch<any>) => {
        const token = store.getState().auth.token;


        try {
            const res = await axios.get("/users/" + userRef, {
                headers: {
                    Authorization: "Bearer " + token,
                },
                cancelToken: source.token,
            });
            dispatch(dataActions.addUser({ user: res.data.user }));



        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(authActions.setToken(null));
                dispatch(authActions.setUser(null));
            }

            if (axios.isCancel(error))
                console.log('req is canceled', error);


        } finally {

        }

    }
};
