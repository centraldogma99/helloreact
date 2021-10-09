import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { chat } from "./types/chat"
import { InputForm } from "./InputForm";
import { Chat } from "./Chat";

const serverAddress = "http://localhost:9000";

export function Chatting(props: { roomId: number }) {
  const [socket, setSocket] = useState<any>();
  const [chats, setChats] = useState<chat[]>([])

  const renderChats = () => {
    let i = 0;
    return chats.map(chat => {
      i++;
      return <Chat key={i} author={chat.author} text={chat.text} time={chat.time} />
    })
  }

  useEffect(() => {
    setSocket(
      io(serverAddress, {
        query: {
          roomId: props.roomId as any //FIXME
        }
      })
    );
    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    const handleChat = (chat: chat) => {
      console.log(chat);
      setChats([...chats, chat])
    }
    socket?.off('chatEvent', handleChat).on('chatEvent', handleChat)

    return () => {
      socket?.off('chatEvent', handleChat)
    }
  })

  return (
    <div>
      <p>{props.roomId}번 채팅방입니다.</p>
      <table>
        {renderChats()}
      </table>
      <InputForm socket={socket} />
    </div>
  )
}