import axios, { CancelTokenSource } from "axios";
import { Dispatch } from "react";
import store, {  authActions, dataActions } from "..";


export const likeAction = (tweetRef: string, source: CancelTokenSource, before: () => void, after: () => void) => {
    return async (dispatch: Dispatch<any>) => {
        const token = store.getState().auth.token;

        before();

        try {
            await axios.post(
                "/tweets/" + tweetRef + "/likes",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },

                    cancelToken: source.token,
                }
            );
            dispatch(dataActions.like({ tweetId: tweetRef }));



            after();

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


export const disLikeAction = (tweetRef: string, source: CancelTokenSource, before: () => void, after: () => void) => {
    return async (dispatch: Dispatch<any>) => {
        const token = store.getState().auth.token;

        before();
        try {
            await axios.delete(
                "/tweets/" + tweetRef + "/likes",

                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },

                    cancelToken: source.token,
                }
            );
            dispatch(dataActions.disLike({ tweetId: tweetRef }));


            after();


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
