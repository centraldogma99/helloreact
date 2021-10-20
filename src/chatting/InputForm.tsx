import React, { useState } from "react";
import { Socket } from "socket.io-client";

export function InputForm(props: { socket: Socket, author: string }) {
  const [text, setText] = useState<string>("");

  const handleChange = (e: any, field: "text") => {
    const target = e.target as HTMLInputElement;
    if (field === "text") setText(target.value);
  }

  const handleClick = () => {
    console.log("handleClick: " + props.author);
    props.socket.emit('chatEvent', { author: props.author, text: text, time: new Date() });
    setText("");
  }

  return (
    <div id="inputForm">
      <input type="text" name="text" onChange={(e) => { handleChange(e, "text") }} value={text} />
      <input type="button" value="Send" onClick={handleClick} />
    </div>
  )
}