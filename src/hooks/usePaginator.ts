import { useEffect, useState, useRef } from "react"
import { chat } from "../chatting/types/chat"
import _ from "lodash";

const chunkArray = (inputArray: any[], perChunk: number) => {
  return inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])
}

const usePaginator = (data: any[], scrollLength: number, inverse = false) => {
  const chunked = chunkArray(data, scrollLength);
  const [pagedArr, setPagedArr] = useState<chat[][]>(chunked);
  const [cursor, setCursor] = useState<number>(inverse ? chunked.length - 1 : 0);
  const [isNewChat, setIsNewChat] = useState<boolean>(false);
  // const hasNext = useRef<boolean>(false);

  // const [nextItem, setNextItem] = useState<{ data: chat[], isNewChat: boolean }>({ data: [], isNewChat: false });

  // 데이터가 바뀌는 유일한 수단은 newChat이다.
  // 따라서 최초 한 번만 실행.
  useEffect(() => {
    console.log("useEffect of usePaginator");
    // if (inverse) {
    //   cursor.current = chunked.length - 1;
    //   if (cursor.current - 1 >= 0) hasNext.current = true;
    // } else {
    //   cursor.current = 0;
    //   if (cursor.current + 1 < chunked.length) hasNext.current = true;
    // }
    // setNextItem({ data: chunked[cursor.current], isNewChat: false })
  }, [])

  const newChat = (newChat: chat) => {
    console.log("newChat()")
    if (pagedArr[pagedArr.length - 1].length < scrollLength) {
      const lastEl = pagedArr[pagedArr.length - 1].concat(newChat);
      setPagedArr(prev => [...prev.slice(0, prev.length - 1), lastEl])
    } else {
      setPagedArr(prev => [...prev, [newChat]])
    }
    setIsNewChat(true);
    // setNextItem({ data: pagedArr[pagedArr.length - 1], isNewChat: true });
  }

  const next = () => {
    console.log("next()")
    setIsNewChat(false);
    // const ret = pagedArr[cursor];
    if (!inverse) {
      if (pagedArr.length > cursor) {
        setCursor(cursor + 1);
      } else {
        return;
      }
    } else {
      if (cursor > 0) {
        setCursor(cursor - 1);
      } else {
        return;
      }
    }
    // setNextItem({ data: ret, isNewChat: false })
  }
  const nextItem = isNewChat ? { data: pagedArr[pagedArr.length - 1], isNewChat: true } : { data: pagedArr[cursor], isNewChat: false };
  const hasNext = inverse ? cursor > 0 : cursor < pagedArr.length - 1;
  console.log("usePaginator rendered");
  return { newChat, next, nextItem, hasNext }
}

export default usePaginator;