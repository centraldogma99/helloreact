import React, { useState } from "react";
import { chat } from "./types/chat"

export function Chat(props: chat) {
  const [chat, setChat] = useState<chat>({ author: props.author, text: props.text, time: props.time })

  const handleClick = () => {
    console.log("hello");
  }

  return (
    <tr>
      <td>{chat.author} : </td>
      <td>{chat.text}</td>
      <td>{chat.time.toString()}</td>
      <td><input type="button" onClick={handleClick} /></td>
    </tr>
  );
}