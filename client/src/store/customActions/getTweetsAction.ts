import axios, { CancelTokenSource } from "axios";
import { Dispatch } from "react";
import store, { authActions, dataActions, appActions} from "..";


export const getTweets = (page: number, source: CancelTokenSource,) => {
    return async (dispatch: Dispatch<any>) => {
        const token = store.getState().auth.token;
        if (store.getState().app.homeTweetsData.loading)
            return;
        dispatch(appActions.setHomeTweetsDataLoading(true));

        try {
            const res = await axios.get(
                "/tweets?page=" + page,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },

                    cancelToken: source.token,
                }
            );



            dispatch(dataActions.addTweets(res.data.tweets));

        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(authActions.setToken(null));
                dispatch(authActions.setUser(null));
            }

            if (axios.isCancel(error))
                console.log('req is canceled', error);


        } finally {
            dispatch(appActions.setHomeTweetsDataLoading(false));
        }

    }
};
