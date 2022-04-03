import axios, { CancelTokenSource } from "axios";
import { Dispatch } from "react";
import { appActions} from "..";


export const resetAction = (  email: string , source: CancelTokenSource, after: () => void) => {
    return async (dispatch: Dispatch<any>) => {

        try {
            dispatch(appActions.setResetLoading(true));

            await axios.post("/password/recovery", {

                email

            }, { cancelToken: source.token });

            after();
        } catch (error: any) {
            if (error.response?.status === 400) {
                dispatch(appActions.setResetErrs(error.response.data.data));
            }
            if (axios.isCancel(error))
                console.log('req is canceled', error);

        } finally {
            dispatch(appActions.setResetLoading(false));

        }



    }
};
