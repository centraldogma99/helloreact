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

export function Chatting(props: { roomId: number }) {
  console.log("chatting()")
  const scrollLength = 25;

  const self = useRef<any>(null);
  const [socket, setSocket] = useState<any>();

  const { items, hasNext, next, newChat, isFetching, setIsFetching } = useInfiniteScrollInverse(props.roomId, scrollLength, self.current);
  const topEl = useRef<any>(null);

  const renderChats = (chats: chat[]) => {
    if (!chats || chats.length === 0) return;
    return chats.map((chat, index) => <Chat key={index} author={chat.author} text={chat.text} time={chat.time} />)
  }

  useEffect(() => {
    const div = self.current;
    const handleScroll = () => {
      const isScrolledToTop = self.current.scrollTop === 0;
      console.log("isScrolledToTop : " + isScrolledToTop);
      console.log("hasNext : " + hasNext);
      // console.log("isFetching : " + isFetching);
      if (isScrolledToTop && hasNext && !isFetching) next();
    }
    self.current.addEventListener('scroll', _.throttle(handleScroll, 500));

    return () => {
      div.removeEventListener('scroll', _.throttle(handleScroll, 500));
    }
  }, [isFetching, hasNext])


  // self.current.addEventListener('scroll', _.throttle(handleScroll, 500));

  useEffect(() => {
    if (!topEl.current) {
      // 처음 렌더링돼었을 때
      // 맨 아래로 스크롤하고, top element 설정
      self.current.scrollTop = self.current.scrollHeight - self.current.clientHeight;
      topEl.current = document.getElementById("chats")?.children[1];
    } else {
      // 두번째 이후 렌더링
      if (!items.isNewChat) {
        // load more을 통해 렌더링 된 경우
        // top element로 스크롤 후 top element를 재설정
        topEl.current.scrollIntoView(true);
        topEl.current = document.getElementById("chats")?.children[1];
        console.log("setIsFetching false")
      } else {
        // newChat을 통해 렌더링 된 경우
        // 맨 아래로 스크롤
        self.current.scrollTop = self.current.scrollHeight - self.current.clientHeight;
      }
    }
    setIsFetching(false);
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
                {/* {hasNext && <input type="button" value="load more" onClick={() => { next() }} />} */}
                {isFetching && 'Loading...'}
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