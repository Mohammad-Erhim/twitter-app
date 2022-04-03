import axios, {  CancelTokenSource } from "axios";
import { Dispatch } from "react";
import   { authActions, appActions} from "..";


export const loginAction = (email: string, password: string, source: CancelTokenSource) => {
    return async (dispatch: Dispatch<any>) => {

        try {
            dispatch(appActions.setLoginLoading(true));

            const res = await axios.post("/login", {
                email,
                password,
            },{ cancelToken: source.token,});


            dispatch(authActions.setToken(res.data.token));
        } catch (error: any) {
            if (error.response?.status === 400) {
                dispatch(appActions.setLoginErrs(error.response.data.data));
            }
            if (axios.isCancel(error))
                console.log('req is canceled', error);

        } finally {
            dispatch(appActions.setLoginLoading(false));

        }



    }
};
