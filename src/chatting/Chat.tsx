import React, { useState } from "react";
import { chat } from "./types/chat"

export function Chat(props: chat) {
  const [chat, setChat] = useState<chat>({ author: props.author, text: props.text, time: props.time })
  // FIXME chat을 state로서 유지하고 싶다면?
  const handleClick = () => {
    console.log("hello");
  }

  return (
    <tr>
      <td className="author">{props.author}</td>
      <td className="chatText">{props.text}</td>
      <td className="time">{new Date(props.time).toLocaleTimeString("ko-KR")}</td>
      <td><input type="button" onClick={handleClick} /></td>
    </tr>
  );
}