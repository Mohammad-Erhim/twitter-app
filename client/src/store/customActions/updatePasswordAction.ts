import axios, { CancelTokenSource } from "axios";
import { Dispatch } from "react";
import { appActions} from "..";


export const updatePasswordAction = (password: string, confirmPassword: string, recoveryToken: string, source: CancelTokenSource, after: () => void) => {
    return async (dispatch: Dispatch<any>) => {

        try {
            dispatch(appActions.setUpdatePasswordLoading(true));

            await axios.post("/password/set/" + recoveryToken, {

                password,
                confirmPassword

            }, { cancelToken: source.token });

            after();
        } catch (error: any) {
            if (error.response?.status === 400) {
                dispatch(appActions.setUpdatePasswordErrs(error.response.data.data));
            }
            if (axios.isCancel(error))
                console.log('req is canceled', error);

        } finally {
            dispatch(appActions.setUpdatePasswordLoading(false));

        }



    }
};
