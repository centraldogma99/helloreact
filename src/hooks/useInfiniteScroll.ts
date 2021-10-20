import { useEffect, useState } from "react";
import usePaginator from "./usePaginator";
import _ from "lodash";

const useInfiniteScroll = (data: any[], scrollLength: number, scrollableElement?: any) => {
  const [items, setItems] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { hasNext, next } = usePaginator(data, scrollLength);

  const loadItems = async () => {
    if (hasNext) {
      // setItems(prev => [...prev, ...next().data])
      setIsFetching(false);
    }
    return;
  }

  const handleScroll = async () => {
    const isScrolledToBottom = scrollableElement ?
      scrollableElement.scrollTop !== (scrollableElement.scrollHeight - scrollableElement.offsetHeight) :
      window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight;

    if (isScrolledToBottom || isFetching) return;
    else {
      setIsFetching(true);
    }
  }

  useEffect(() => {
    if (isFetching && hasNext) {
      loadItems();
    } else {
      if (!hasNext) console.log("nomoreItem")
      return;
    }
  }, [isFetching])

  useEffect(() => {
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', _.throttle(handleScroll, 300));
    } else {
      window.addEventListener('scroll', _.throttle(handleScroll, 300));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      scrollableElement?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollableElement])

  useEffect(() => {
    loadItems();
  }, [data])

  return { items, isFetching };
}

export default useInfiniteScroll;