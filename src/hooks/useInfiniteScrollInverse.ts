import { useState, useRef } from "react";
import { chat } from "../chatting/types/chat"
// import _ from "lodash";

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

const useInfiniteScrollInverse = (chats: chat[], scrollLength: number) => {
  const chunked = chunkArray(chats, scrollLength);
  const [items, setItems] = useState<chat[]>(chunked[chunked.length - 1]);
  // const [cursor, setCursor] = useState<number>(chunked.length - 1);
  const cursor = useRef<number>(chunked.length - 1);

  // 새로운 채팅을 등록하고 그것을 렌더링하도록 함
  const newChat = (newChat: chat) => {
    console.log("newChat()")
    setItems(prev => [...prev, newChat]);
    // setNextItem({ data: pagedArr[pagedArr.length - 1], isNewChat: true });
  }

  const next = () => {
    console.log("next()")
    if (cursor.current > 0) {
      cursor.current--;
      setItems(prev => [...chunked[cursor.current], ...prev]);
    } else {
      console.log("next: noMoreItems")
      return;
    }
  }
  console.log("useInfiniteScroll()")
  const hasNext = cursor.current > 0;
  return { items, hasNext, newChat, next }


  //   // return null;
  // }

  // const handleScroll = async () => {
  //   const isScrolledToBottom = scrollableElement ?
  //     scrollableElement.scrollTop !== 0 :
  //     document.documentElement.scrollTop !== 0;

  //   if (isScrolledToBottom || isFetching) return;
  //   else {
  //     setIsFetching(true);
  //   }
  // }

  // useEffect(() => {
  //   if (isFetching && hasNext) {
  //     loadItems();
  //   } else {
  //     if (!hasNext) console.log("nomoreItem")
  //     return;
  //   }
  // }, [isFetching])

  // useEffect(() => {
  //   if (scrollableElement) {
  //     scrollableElement.addEventListener('scroll', _.throttle(handleScroll, 300));
  //   } else {
  //     window.addEventListener('scroll', _.throttle(handleScroll, 300));
  //   }

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     scrollableElement?.removeEventListener('scroll', handleScroll);
  //   };
  // }, [scrollableElement])

  // 새로운 채팅을 치면...
  console.log("scroll rendered")
}

export default useInfiniteScrollInverse;