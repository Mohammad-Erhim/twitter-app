import axios, { CancelTokenSource } from "axios";
import { Dispatch } from "react";
import store, { authActions, appActions } from "..";


export const logoutAction = ( source: CancelTokenSource) => {
    return async (dispatch: Dispatch<any>) => {
        let token = store.getState().auth.token;
        try {
            dispatch(appActions.setLogoutLoading(true));

            await axios.post("/logout", {

            }, {
                cancelToken: source.token, headers: {
                    Authorization: "Bearer " + token,
                },
            });

            dispatch(authActions.setToken(null));
            dispatch(authActions.setUser(null));
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(authActions.setToken(null));
                dispatch(authActions.setUser(null));
            }

            if (axios.isCancel(error))
                console.log('req is canceled', error);

        } finally {
            dispatch(appActions.setLogoutLoading(false));

        }



    }
};
