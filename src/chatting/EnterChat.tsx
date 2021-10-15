import React, { useState } from "react";
import { Chatting } from "./Chatting";
import _ from "lodash"

export const EnterChat = () => {
  const [roomId, setRoomId] = useState<any>();
  const [chatting, setChatting] = useState<any>();
  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleChange = (e: any) => {
    const target = e.target as HTMLInputElement;
    if (isNaN(target.value as any)) {
      setRoomId("");
      setStatusMessage("숫자를 입력해 주세요.");
    } else {
      setStatusMessage("");
      setRoomId(Number(target.value));
    }

  }

  const handleClick = () => {
    if (!roomId) {
      setStatusMessage("방 번호를 입력해 주세요.");
      return;
    }
    setChatting(<Chatting roomId={roomId} />)
  }

  return (
    <div id="chat">
      <input type="text" name="roomId" onChange={handleChange} value={roomId} />
      <input type="button" name="roomIdBtn" value="입장" onClick={_.throttle(handleClick, 200)} />
      <p>{statusMessage}</p>
      {chatting}
    </div>
  )
}