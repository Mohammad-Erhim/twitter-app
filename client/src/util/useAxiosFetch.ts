import {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions, RootState } from "../store";

const useAxiosFetch = (url: string, timeout?: number) => {
    const [data, setData] = useState<AxiosResponse | null>(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    
  const dispatch = useDispatch();
    const { token } = useSelector((state: RootState) => state.auth);
    useEffect(() => {
        console.log(url);
        
        let unmounted = false;
        let source = axios.CancelToken.source();
        axios.get(url, {
            cancelToken: source.token,
            timeout: timeout,
            headers: {
                Authorization: "Bearer " + token,
              }
        })
            .then(a => {
                if (!unmounted) {
                    // @ts-ignore
                    setData(a);
                    setLoading(false);
                }
            }).catch(function (e) {
            if (!unmounted) {
                setError(true);
                setErrorMessage(e);
                if (e.response.status === 401) dispatch(authActions.setToken(null)); 
                setLoading(false);
                if (axios.isCancel(e)) {
                    console.log(`request cancelled:${e.message}`);
                } else {
                    console.log("another error happened:" + e.message);
                }
            }
        });
        return function () {
            unmounted = true;
            source.cancel("Cancelling in cleanup");
        };
    }, [url, timeout,dispatch,token]);

    return {data, loading, error, errorMessage};
};

export default useAxiosFetch;
 