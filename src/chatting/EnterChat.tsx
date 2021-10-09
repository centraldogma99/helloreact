import React, { useState } from "react";
import { Chatting } from "./Chatting";

export const EnterChat = () => {
  const [roomId, setRoomId] = useState<number>(0);
  const [chatting, setChatting] = useState<any>();

  const handleChange = (e: any) => {
    const target = e.target as HTMLInputElement;
    setRoomId(Number(target.value));
  }

  const handleClick = () => {
    setChatting(<Chatting roomId={roomId} />)
  }

  return (
    <div id="chat">
      <input type="text" name="roomId" onChange={handleChange} />
      <input type="button" name="roomIdBtn" value="입장" onClick={handleClick} />
      {chatting}
    </div>
  )
}