import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { chat } from "./types/chat"
import { InputForm } from "./InputForm";
import { Chat } from "./Chat";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const serverAddress = "http://localhost:9000";

export function Chatting(props: { roomId: number }) {
  const scrollLength = 25;
  const self = useRef<any>(null);
  const [socket, setSocket] = useState<any>();

  const [chats, setChats] = useState<chat[]>(Array.from({ length: 199 }).map(
    (i, index) => {
      return {
        author: "author" + index,
        text: index.toString(),
        time: new Date()
      }
    }));

  const { items } = useInfiniteScroll(chats, scrollLength, self.current);
  const renderChats = (chats: chat[]) => {
    return chats.map((chat, index) => <Chat key={index} author={chat.author} text={chat.text} time={chat.time} />)
  }

  useEffect(() => {
    const socket = io(serverAddress, {
      query: {
        roomId: props.roomId as any //FIXME
      }
    });

    const handleChat = (chat: chat) => {
      console.log(chat);  // TEST
      setChats(prev => [...prev, chat])
    }

    socket?.on('chatEvent', handleChat);
    setSocket(socket);

    return () => {
      socket?.off('chatEvent', handleChat);
      socket.disconnect();
    }
  }, [])

  return (
    <div ref={self} id="chatting">
      <p>{props.roomId}번 채팅방입니다.</p>
      <table>
        <tbody>
          {renderChats(items)}
        </tbody>
      </table>
      <InputForm socket={socket} />
    </div >
  )
}