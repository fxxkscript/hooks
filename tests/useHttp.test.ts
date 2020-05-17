import { renderHook, act } from '@testing-library/react-hooks';
import { useHttp } from '../src/useHttp';

test('should use http hook', () => {
  const { result } = renderHook(() => useHttp(() => {}));

  const [state] = result.current;

  expect(state).toEqual({
    isLoading: false,
    isError: false,
    data: null,
    isLoaded: false,
    payload: null,
  });
});

test('should use http hook async', async () => {
  const fetch = jest.fn(() => Promise.resolve({
    result: 1
  }));
  const { result,  waitForNextUpdate } = renderHook(() => useHttp(fetch));

  let doFetch = result.current[1];

  act(() => {
    doFetch({
      req: 1
    });
  });

  expect(result.current[0]).toEqual({
    isLoading: true,
    isError: false,
    data: {
      req: 1
    },
    isLoaded: false,
    payload: null,
  });

  await waitForNextUpdate();

  expect(fetch.mock.calls.length).toBe(1);

  expect(result.current[0]).toEqual({
    isLoading: false,
    isError: false,
    data: {
      req: 1
    },
    isLoaded: true,
    payload: {
      result: 1
    },
  })
})