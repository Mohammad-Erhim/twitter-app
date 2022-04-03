import axios, { CancelTokenSource } from "axios";
import { Dispatch } from "react";
import store, { appActions, authActions, dataActions } from "..";


export const replyAction = (text: string, tweetId: string, source: CancelTokenSource, after: () => void) => {
    return async (dispatch: Dispatch<any>) => {
        const token = store.getState().auth.token;
        try {
            dispatch(appActions.setReplyLoading(true));

         const res=  await axios.post("/tweets/" + tweetId + "/replies", {
                text
            }, {
                headers: {
                    Authorization: "Bearer " + token,
                }, cancelToken: source.token,
            });

            dispatch(dataActions.incReply({tweetId}))
            dispatch(dataActions.addReply({...res.data.reply,userRef:res.data.reply.userRef._id}));


            after();
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(authActions.setToken(null));
                dispatch(authActions.setUser(null));
            }

            if (axios.isCancel(error))
                console.log('req is canceled', error);

        } finally {
            dispatch(appActions.setReplyLoading(false));

        }



    }
};
