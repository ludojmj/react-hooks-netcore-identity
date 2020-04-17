import { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import apiReducer, { initialState } from './apiReducer';

const useApi = (initialParam) => {
  const [axiosParams, setAxiosParams] = useState(initialParam);
  const [state, dispatch] = useReducer(apiReducer, initialState);


  useEffect(() => {
    let didCancel = false;

    const makeRequest = async () => {
      dispatch({ type: "PENDING" });

      try {
        const result = await axios(axiosParams);

        if (!didCancel) {
          dispatch({ type: axiosParams.method, payload: result.data, id: axiosParams.url.split("/").pop() });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "REJECTED", payload: getErrorMsg(error) });
        }
      }
    };

    makeRequest();

    return () => {
      didCancel = true;
    };
  }, [axiosParams]);

  return [state, setAxiosParams];
};

export default useApi;

const getErrorMsg = error => {
  const msg = "An error occured. Try again later.";
  if (error.response && error.response.data && error.response.data.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  if (error) {
    return error;
  }
  return msg;
};