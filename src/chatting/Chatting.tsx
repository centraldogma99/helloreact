import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { io } from "socket.io-client";
import { chat } from "./types/chat"
import { InputForm } from "./InputForm";
import { Chat } from "./Chat";
import _ from "lodash"
import useInfiniteScrollInverse from "../hooks/useInfiniteScrollInverse";
import axios from "axios"

const serverAddress = "http://localhost:9000";
const chatServerAddr = 'http://localhost:9000/chats'

const fetchData = (roomId: number, page: number) => {
  console.log("fetchData()")
  return axios.get(chatServerAddr, {
    params: {
      roomId: roomId,
      page: page
    }
  })
}

export function Chatting(props: { roomId: number }) {
  console.log("chatting()")
  const scrollLength = 25;

  const self = useRef<any>(null);
  const [socket, setSocket] = useState<any>();

  const [items, setItems] = useState<{ data: chat[], isNewChat: boolean }>({ data: [], isNewChat: false });
  const [page, setPage] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);

  useEffect(() => {
    console.log("useEfffect of page")
    console.log(hasNext)
    fetchData(props.roomId, page)
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

  // const { items, hasNext, newChat, next, isNewChat } = useInfiniteScrollInverse(props.roomId, scrollLength, self.current);
  const topEl = useRef<any>(null);

  const renderChats = (chats: chat[]) => {
    if (!chats || chats.length === 0) return;
    return chats.map((chat, index) => <Chat key={index} author={chat.author} text={chat.text} time={chat.time} />)
  }

  useEffect(() => {
    console.log("useEffect of Items");
    console.log(hasNext)

    if (!topEl.current) {
      // 처음 렌더링돼었을 때
      // 맨 아래로 스크롤하고, top element 설정
      self.current.scrollTop = self.current.scrollHeight - self.current.clientHeight;
      topEl.current = document.getElementById("chats")?.children[1];

      // 스크롤 이벤트는 일시적으로 비활성화했음
      const handleScroll = () => {
        const isScrolledToTop = self.current.scrollTop === 0;
        if (isScrolledToTop && hasNext) next();
      }
      // self.current.addEventListener('scroll', _.throttle(handleScroll, 300));
    } else {
      // 두번째 이후 렌더링
      if (!items.isNewChat) {
        // load more을 통해 렌더링 된 경우
        // top element로 스크롤 후 top element를 재설정
        topEl.current.scrollIntoView(true);
        topEl.current = document.getElementById("chats")?.children[1];
      } else {
        // newChat을 통해 렌더링 된 경우
        // 맨 아래로 스크롤
        self.current.scrollTop = self.current.scrollHeight - self.current.clientHeight;
      }
    }
  }, [items])


  useEffect(() => {
    console.log("useEffect of chatting[]")
    // 소켓 연결 및 이벤트 등록
    const socket = io(serverAddress);
    socket.on("connect", () => {
      socket.emit("join", props.roomId)
    })
    socket.on('joined', (roomId, chats) => {
      console.log("joined");
      // items 초기값 설정
    })

    // 소켓에서 chat이벤트 받을시 채팅 새로 렌더링
    const handleChat = (chat: chat) => { newChat(chat); }
    socket.on('chatEvent', handleChat);
    setSocket(socket);

    return () => {
      socket?.off('chatEvent', handleChat);
      socket.disconnect();
    }
  }, [])

  return (
    <>
      <p>{props.roomId}번 채팅방입니다.</p>
      <div ref={self} id="chatting">
        <table>
          <tbody id="chats">
            <tr>
              <td>
                {hasNext && <input type="button" value="load more" onClick={() => { next() }} />}
              </td>
            </tr>
            {renderChats(items.data)}
          </tbody>
        </table>
      </div >
      <InputForm socket={socket} />
    </>
  )
}