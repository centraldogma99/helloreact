// FIXME scrollLength 사용하도록

import { useState, useRef, useEffect } from "react";
import { chat } from "../chatting/types/chat"
import _ from "lodash";
import axios from "axios";

const chatServerAddr = 'http://ec2-18-116-38-81.us-east-2.compute.amazonaws.com/:9000/chats'

interface chatRes {
  data: chat[],
  page: number,
  totalPage: number,
  totalChats: number
}

const fetchData = (roomId: number, page: number, pageSize: number) => {
  console.log("fetchData()")
  return axios.get(chatServerAddr + '/' + roomId, {
    params: {
      page: page,
      pageSize: pageSize
    }
  })
}

const useInfiniteScrollInverse = (roomId: number, scrollLength: number) => {
  console.log("useInfiniteScrollInverse rendered")
  const [items, setItems] = useState<{ data: chat[], isNewChat: boolean }>({ data: [], isNewChat: false });
  const [page, setPage] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    console.log("useEfffect of page")

    fetchData(roomId, page, scrollLength)
      .then((res: any) => {
        const data = res.data;
        console.log(data);
        // 로딩 메시지 테스트를 위해 일부러 setTimeout
        setTimeout(() => {
          setItems(prev => {
            return {
              data: [...data.data, ...prev.data],
              isNewChat: false
            }
          })
        }, 1000)

        setHasNext(page + 1 <= data.totalPage)
        console.log("fetch done")
      })
  }, [page])

  const next = () => {
    console.log('next()')
    console.log('hasNext ' + hasNext)
    if (hasNext) {
      setIsFetching(true);
      setPage(page + 1);
    }
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

  return { items, hasNext, next, newChat, isFetching, setIsFetching }
}

export default useInfiniteScrollInverse;