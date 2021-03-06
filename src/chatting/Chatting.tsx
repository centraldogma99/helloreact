import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { io } from "socket.io-client";
import { chat } from "./types/chat"
import { InputForm } from "./InputForm";
import { Chat } from "./Chat";
import _ from "lodash"
import useInfiniteScrollInverse from "../hooks/useInfiniteScrollInverse";
import Cookies from "js-cookie";

const serverAddress = "http://ec2-18-116-38-81.us-east-2.compute.amazonaws.com/:9000";

export function Chatting(props: { roomId: number, exitRoom: () => void }) {
  console.log("chatting()")
  const scrollLength = 25;

  const self = useRef<any>(null);
  const [socket, setSocket] = useState<any>();
  const [isSecretRoom, setIsSecretRoom] = useState<boolean>(false);

  const { items, hasNext, next, newChat, isFetching, setIsFetching } = useInfiniteScrollInverse(props.roomId, scrollLength);
  const topEl = useRef<any>(null);

  const renderChats = (chats: chat[]) => {
    if (!chats || chats.length === 0) return;
    return chats.map((chat, index) => <Chat key={index} author={chat.author} text={chat.text} time={chat.time} />)
  }

  useEffect(() => {
    const handleScroll = () => {
      const isScrolledToTop = self.current.scrollTop === 0;
      console.log("handleScroll()");
      if (isScrolledToTop && hasNext && !isFetching) next();
    }
    const div = self.current;
    const throttledHandleScroll = _.throttle(handleScroll, 500)
    div.addEventListener('scroll', throttledHandleScroll);

    return () => {
      div.removeEventListener('scroll', throttledHandleScroll);
    }
  }, [isFetching, hasNext, self])

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
        // topEl.current.scrollIntoView(true);
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
      socket.emit("join", props.roomId, Cookies.get('credential'))
    })
    socket.on('joined', (roomId, username) => {
      console.log(username + " joined");
      const newUserChat = { author: username, text: "님이 채팅방에 참여했습니다.", time: new Date() };
      socket.emit('chatEvent', newUserChat);
    })

    // 소켓에서 chat이벤트 받을시 채팅 새로 렌더링
    const handleChat = (chat: chat) => { newChat(chat); }
    socket.on('chatEvent', handleChat);
    setSocket(socket);

    return () => {
      console.log("useEffect[] cleaned")
      socket.off('chatEvent', handleChat);
      socket.disconnect();
    }
  }, [])

  const handleIsSecretRoom = (e: any) => {
    setIsSecretRoom(e.target.checked);
  }

  return (
    <>
      {props.roomId}번 채팅방입니다. &nbsp; <input type="button" value="나가기" onClick={props.exitRoom} />
      <div ref={self} id="chatting">
        <table id="chattingTable">
          <tbody id="chats">
            <tr>
              <td>
                {isFetching && 'Loading...'}
              </td>
            </tr>
            {renderChats(items.data)}
          </tbody>
        </table>
      </div >
      <InputForm socket={socket} />
      {/* <input type="checkbox" name="isSecretRoom" onChange={handleIsSecretRoom} /> */}
      {/* <label htmlFor="isSecretRoom">비밀방(초대를 통해서만 입장 가능)</label> */}
    </>
  )
}