import { useEffect, useReducer, useCallback } from "react";

interface State {
  data: Action['data'];
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  payload: Action['payload'];
}

interface Action {
  type: string;
  data?: any;
  payload?: any;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        data: action.data,
        isLoading: false,
        isLoaded: false,
        isError: false,
        payload: null,
      };
    case "FETCH_START":
      return {
        ...state,
        isLoading: true,
        isError: false,
        isLoaded: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        isLoaded: true,
        payload: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        isLoaded: true,
        payload: null,
      };
    default:
      throw new Error();
  }
};

export const useHttp = (fetch: Function) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    data: null,
    isLoaded: false,
    payload: null,
  });

  const doFetch = useCallback((data: any) => {
    dispatch({
      type: "FETCH_INIT",
      data: data,
    });
  }, []);

  useEffect(() => {
    if (!state.data) {
      return;
    }
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const result = await fetch(state.data);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [fetch, state.data]);

  return [state, doFetch];
};
