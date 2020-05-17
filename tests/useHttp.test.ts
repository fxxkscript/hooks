import { renderHook, act } from '@testing-library/react-hooks';
import { useHttp } from '../src/useHttp';

test('should use http hook async', () => {
  const fetch = jest.fn(() =>
    Promise.resolve({
      result: 1,
    })
  );
  const { result } = renderHook(() => useHttp(fetch));

  const [state] = result.current;

  expect(state).toEqual({
    isLoading: false,
    isError: false,
    data: null,
    isLoaded: false,
    payload: null,
  });
});

test('should use http hook async and fetch success', async () => {
  const fetch = jest.fn(() =>
    Promise.resolve({
      result: 1,
    })
  );
  const { result, waitForNextUpdate } = renderHook(() => useHttp(fetch));

  let doFetch = result.current[1];

  act(() => {
    doFetch({
      req: 1,
    });
  });

  expect(result.current[0]).toEqual({
    isLoading: true,
    isError: false,
    data: {
      req: 1,
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
      req: 1,
    },
    isLoaded: true,
    payload: {
      result: 1,
    },
  });
});


test('should work even if request data is empty', async () => {
  const fetch = jest.fn(() =>
    Promise.resolve({
      result: 1,
    })
  );
  const { result, waitForNextUpdate } = renderHook(() => useHttp(fetch));

  act(() => {
    result.current[1]();
  });

  await waitForNextUpdate();

  expect(result.current[0]).toEqual({
    isLoading: false,
    isError: false,
    data: undefined,
    isLoaded: true,
    payload: {
      result: 1,
    },
  });
});

test('unmount before fetch', async () => {
  const fetch = jest.fn(() =>
    Promise.resolve({
      result: 1,
    })
  );
  const { result, unmount } = renderHook(() => useHttp(fetch));

  let doFetch = result.current[1];

  act(() => {
    unmount();

    doFetch({
      req: 1,
    });
  });


  expect(result.current[0]).toEqual({
    isLoading: false,
    isError: false,
    isLoaded: false,
    payload: null,
    data: null,
  });
});

// test('rerender before fetch', async () => {
//   const fetch = jest.fn(() =>
//     Promise.resolve({
//       result: 1,
//     })
//   );
//   const { result, rerender } = renderHook(() => useHttp(fetch));

//   let doFetch = result.current[1];

//   act(() => {
//     doFetch();
//   });

//   rerender();

//   expect(result.current[0]).toEqual({
//     isLoading: true,
//     isError: false,
//     isLoaded: false,
//     payload: null,
//     data: {
//       req: 1
//     },
//   });

//   // act(() => {
//   //   rerender();
//   // });

// });

