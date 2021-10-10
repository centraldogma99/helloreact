import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { chat } from "./types/chat"
import { InputForm } from "./InputForm";
import { Chat } from "./Chat";
import InfiniteScroll from 'react-infinite-scroll-component';

const serverAddress = "http://localhost:9000";

export function Chatting(props: { roomId: number }) {
  const [socket, setSocket] = useState<any>();
  const [chats, setChats] = useState<chat[]>(Array.from({ length: 100 }).map(
    (i, index) => {
      return {
        author: "author" + index,
        text: index.toString(),
        time: new Date()
      }
    }));
  const [loadIdx, setLoadIdx] = useState<number>(-1);
  const [targetChats, setTargetChats] = useState<chat[]>(chats.slice(0, 40));

  const numOfAScroll = 20;


  const renderChats = () =>
    targetChats.map((chat, index) => <Chat key={index} author={chat.author} text={chat.text} time={chat.time} />)

  const fetchChats = () => {
    const t = Array.from({ length: numOfAScroll }).map((_, index) => {
      const i = index + targetChats.length
      return {
        author: "author" + i,
        text: i.toString(),
        time: new Date()
      }
    });
    setTimeout(() => { setTargetChats(prev => [...prev, ...t]) }, 1000)
  }

  useEffect(() => {
    const socket = io(serverAddress, {
      query: {
        roomId: props.roomId as any //FIXME
      }
    });

    const handleChat = (chat: chat) => {
      console.log(chat);
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
    <div>
      <InfiniteScroll
        dataLength={targetChats.length}
        next={fetchChats}
        hasMore={true}
        loader={<h4>loading...</h4>}
      >
        <p>{props.roomId}번 채팅방입니다.</p>
        <table>
          {targetChats.map(
            (chat, index) =>
              <Chat key={index} author={chat.author} text={chat.text} time={chat.time} />
          )}
        </table>
        <InputForm socket={socket} />
      </InfiniteScroll>
    </div>
  )
}