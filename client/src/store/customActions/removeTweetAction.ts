import axios, { CancelTokenSource } from "axios";
import { Dispatch } from "react";
import store, { appActions, authActions, dataActions } from "..";


export const removeTweetAction = (tweetRef: string, source: CancelTokenSource,before: () => void, after: () => void) => {
    return async (dispatch: Dispatch<any>) => {
        const token = store.getState().auth.token;

   before();

        try {
            await axios.delete(
                "/tweets/" + tweetRef,
        
                {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                  cancelToken: source.token,
                }
              );     
              
              dispatch(dataActions.deleteTweet({tweetId:tweetRef}));
       
after();



        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(authActions.setToken(null));
                dispatch(authActions.setUser(null));
            }

            if (axios.isCancel(error))
                console.log('req is canceled', error);


        } finally {
            dispatch(appActions.setLikeAndRemoveTweetLoading(false));

        }
    }
};

 