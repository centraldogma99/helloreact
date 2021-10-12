import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { chat } from "./types/chat"
import { InputForm } from "./InputForm";
import { Chat } from "./Chat";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const serverAddress = "http://localhost:9000";

export function Chatting(props: { roomId: number }) {
  const scrollLength = 25;
  const [socket, setSocket] = useState<any>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [chats, setChats] = useState<chat[]>(Array.from({ length: 100 }).map(
    (i, index) => {
      return {
        author: "author" + index,
        text: index.toString(),
        time: new Date()
      }
    }));
  const { items, hasMore, loadItems } = useInfiniteScroll(chats, scrollLength);
  const renderChats = (chats: chat[]) => {
    return chats.map((chat, index) => <Chat key={index} author={chat.author} text={chat.text} time={chat.time} />)
  }

  const handleScroll = async () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
    else {
      console.log("fetching new...(setIsFetching set to true)")
      setIsFetching(true);
    }
  }

  useEffect(() => {
    if (isFetching && hasMore) {
      loadItems();
      setIsFetching(false);
      console.log("loadItem in useEffect...(setIsFetching set to false)")
    } else {
      return;
    }
  }, [isFetching])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll) };
  }, [])

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
    <div>
      <p>{props.roomId}번 채팅방입니다.</p>
      <table>
        {renderChats(items)}
        {/* {hasMore && <button onClick={() => { loadItems() }}>Load more</button>} */}
      </table>
      <InputForm socket={socket} />
    </div >
  )
}