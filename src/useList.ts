import { useEffect, useState, useCallback } from "react";
import uniqBy from 'lodash/uniqBy';

const PAGE_SIZE = 10;
type formatCallback = (value: any, index?: number, array?: any[]) => any;
export const useList = (
  payload: any,
  format?: formatCallback
): [
  {
    list: any[];
    page: number;
    allLoaded: boolean;
  },
  {
    reset: Function;
    updateList: Function;
  }
] => {
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    if (!payload) {
      return;
    }

    const totalPage = Math.ceil(payload.total / PAGE_SIZE);
    setTotalPage(totalPage);
    if (page >= totalPage) {
      setAllLoaded(true);
    }
    if (format) {
      setList(c => uniqBy([...c, ...payload.items], 'id').map(format));
    } else {
      setList(c => uniqBy([...c, ...payload.items], 'id'));
    }
  }, [format, page, payload]);

  const reset = useCallback(() => {
    setPage(1);
    setList([]);
    setAllLoaded(false);
  }, []);

  const updateList = useCallback(() => {
    if (page >= totalPage) {
      return;
    }
    setPage(p => p + 1);
    setAllLoaded(false);
  }, [page, totalPage]);

  return [
    {
      list,
      page,
      allLoaded,
    },
    {
      reset,
      updateList,
    },
  ];
};
