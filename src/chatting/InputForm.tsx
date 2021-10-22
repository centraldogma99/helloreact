import React, { useState } from "react";
import { Socket } from "socket.io-client";

export function InputForm(props: { socket: Socket }) {
  const [text, setText] = useState<string>("");

  const handleChange = (e: any, field: "text") => {
    const target = e.target as HTMLInputElement;
    if (field === "text") setText(target.value);
  }

  const handleClick = () => {
    props.socket.emit('chatEvent', { text: text, time: new Date() });
    setText("");
  }

  const handleKeyDown = (e: any) => {
    const code = e.code;
    if (code === 'Enter') handleClick();
    else return;
  }

  return (
    <div id="inputForm" onKeyDown={handleKeyDown}>
      <input type="text" name="text" className="chatInput" onChange={(e) => { handleChange(e, "text") }} value={text} />
      <input type="button" value="Send" onClick={handleClick} />
    </div>
  )
}