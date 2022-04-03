import axios, { CancelTokenSource } from "axios";
import { Dispatch } from "react";
import { appActions} from "..";


export const signupAction = (name: string, email: string, password: string, confirmPassword: string, source: CancelTokenSource, after: () => void) => {
    return async (dispatch: Dispatch<any>) => {

        try {
            dispatch(appActions.setSignupLoading(true));

            await axios.post("/signup", {
                name,
                email,
                password,
                confirmPassword,
            }, { cancelToken: source.token });

            after();
        } catch (error: any) {
            if (error.response?.status === 400) {
                dispatch(appActions.setSignupErrs(error.response.data.data));
            }
            if (axios.isCancel(error))
                console.log('req is canceled', error);

        } finally {
            dispatch(appActions.setSignupLoading(false));

        }



    }
};
