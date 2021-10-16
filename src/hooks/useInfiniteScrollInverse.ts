// FIXME scrollLength 사용하도록

import { useState, useRef, useEffect } from "react";
import { chat } from "../chatting/types/chat"
import _ from "lodash";
import axios from "axios";

const chatServerAddr = 'http://localhost:9000/chats'

interface chatRes {
  data: chat[],
  page: number,
  totalPage: number,
  totalChats: number
}

const fetchData = (roomId: number, page: number) => {
  console.log("fetchData()")
  return axios.get(chatServerAddr, {
    params: {
      roomId: roomId,
      page: page
    }
  })
}

const getChatLength: (roomId: number) => Promise<{ chatLength: number }> = async (roomId: number) => {
  return axios.get(chatServerAddr + '/length', {
    params: {
      roomId: roomId
    }
  })
}

const useInfiniteScrollInverse = (roomId: number, scrollLength: number, scrollableElement: any) => {
  const [items, setItems] = useState<{ data: chat[], isNewChat: boolean }>({ data: [], isNewChat: false });
  const [page, setPage] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);

  useEffect(() => {
    console.log("useEfffect of page")
    console.log(hasNext)
    fetchData(roomId, page)
      .then((res: any) => {
        const data = res.data;
        setItems(prev => {
          return {
            data: [...data.data, ...prev.data],
            isNewChat: false
          }
        })
        setHasNext(page + 1 <= data.totalPage)
        console.log("fetch done")
      })
  }, [page])

  const next = () => {
    console.log('next()')
    if (hasNext) setPage(page + 1);
    else console.error("noMoreItems")
  }

  const newChat = (newChat: chat) => {
    console.log("newChat()");
    setItems(prev => {
      return {
        data: [...prev.data, newChat],
        isNewChat: true
      }
    });
  }

  return { items, hasNext, next, newChat }
}

export default useInfiniteScrollInverse;