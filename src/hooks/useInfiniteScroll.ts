import { useEffect, useRef, useState } from "react";
import useInversePaginator from "./useInversePaginator";

const useInfiniteScroll = (data: any[], scrollLength: number) => {
  const [items, setItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const { next, hasNext } = useInversePaginator(data, scrollLength);
  const loadItems = async () => {
    const h = hasNext();
    if (h) {
      setHasMore(h);
      setTimeout(() => {
        setItems(prev => [...prev, ...next()]);
      }, 1000)
    }

    return;
  }

  // const handleScroll = () => {
  //   if (window.innerHeight + window.scrollY < document.body.offsetHeight) return;
  //   else loadItems();
  // }

  useEffect(() => {
    loadItems();
  }, [])

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => { window.removeEventListener('scroll', handleScroll) };
  // }, [])

  return { items, hasMore, loadItems };
}

export default useInfiniteScroll;