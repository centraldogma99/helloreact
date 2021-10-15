import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { chat } from "./types/chat"
import { InputForm } from "./InputForm";
import { Chat } from "./Chat";
import _ from "lodash"
import useInfiniteScrollInverse from "../hooks/useInfiniteScrollInverse";

const serverAddress = "http://localhost:9000";


export function Chatting(props: { roomId: number }) {
  console.log("chatting()")
  const scrollLength = 25;
  const self = useRef<any>(null);
  const [socket, setSocket] = useState<any>();

  const [chats, setChats] = useState<chat[]>([]);
  const { items, cursor, newChat, next } = useInfiniteScrollInverse(chats, scrollLength, self.current);

  const renderChats = (chats: chat[]) => {
    if (!chats || chats.length === 0) return;
    console.log(chats);
    return chats.map((chat, index) => <Chat key={index} author={chat.author} text={chat.text} time={chat.time} />)
  }
  const hasNext = cursor.current > 0;

  useEffect(() => {
    const socket = io(serverAddress);
    socket.on("connect", () => {
      socket.emit("join", props.roomId)
    })
    socket.on('joined', (roomId, chats) => {
      console.log("joined");
      newChat(chats);
    })

    const handleChat = (chat: chat) => {
      console.log(chat);  // TEST
      // setChats(prev => [...prev, chat])
      newChat(chat);
      self.current.scrollTop = self.current.scrollHeight - self.current.clientHeight;
    }

    socket?.on('chatEvent', handleChat);
    setSocket(socket);

    const handleScroll = async () => {
      const isScrolledToTop = self.current.scrollTop === 0;
      const topEl = document.getElementById("chats")?.children[scrollLength];

      if (isScrolledToTop && hasNext) {
        console.log(hasNext);
        await next();
        topEl?.scrollIntoView(true);
      }
    }
    self.current.scrollTop = self.current.scrollHeight - self.current.clientHeight;
    self.current.addEventListener('scroll', _.throttle(handleScroll, 300));

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
          {hasNext && <input type="button" value="Load more" onClick={() => { next(); }} />}
          <tbody id="chats">
            {renderChats(items)}
          </tbody>
        </table>
      </div >
      <InputForm socket={socket} />
    </>
  )
}