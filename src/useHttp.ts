import { useEffect, useReducer, useCallback } from 'react';

interface State {
  data: Action['data'];
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  payload: Action['payload'];
}

interface Action {
  /** type */
  type: string;
  /** request data */
  data?: any;
  /** response data */
  payload?: any;
}

enum FETCH {
  INIT = 'FETCH_INIT',
  START = 'FETCH_START',
  SUCCESS = 'FETCH_SUCCESS',
  FAILURE = 'FETCH_FAILURE',
  CANCEL = 'FETCH_CANCEL'
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case FETCH.INIT:
      return {
        ...state,
        data: action.data,
        isLoading: false,
        isLoaded: false,
        isError: false,
        payload: null,
      };
    case FETCH.START:
      return {
        ...state,
        isLoading: true,
        isError: false,
        isLoaded: false,
      };
    case FETCH.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        isLoaded: true,
        payload: action.payload,
      };
    case FETCH.FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        isLoaded: true,
        payload: null,
      };
    case FETCH.CANCEL:
      return {
        ...state,
        isLoading: false,
        isError: false,
        isLoaded: false,
        payload: null,
      };
    default:
      throw new Error('[useHttp] type is not right');
  }
};

export function useHttp(fetch: (data: any) => Promise<any>): [any, Function] {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    data: null,
    isLoaded: false,
    payload: null,
  });

  const doFetch: (data: any) => void = useCallback((data: any) => {
    dispatch({
      type: FETCH.INIT,
      data,
    });
  }, []);

  useEffect(() => {
    if (state.data === null) {
      return;
    }
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: FETCH.START });
      try {
        const payload = await fetch(state.data);
        if (!didCancel) {
          dispatch({ type: FETCH.SUCCESS, payload });
        } else {
          dispatch({ type: FETCH.CANCEL });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: FETCH.FAILURE });
        } else {
          dispatch({ type: FETCH.CANCEL });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [fetch, state.data]);

  return [state, doFetch];
}
