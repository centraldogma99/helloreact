import React, { useState } from "react";
import { Socket } from "socket.io-client";

export function InputForm(props: { socket: Socket }) {
  const [author, setAuthor] = useState<string>("");
  const [text, setText] = useState<string>("");

  const handleChange = (e: any, field: "author" | "text") => {
    const target = e.target as HTMLInputElement;
    if (field === "author") setAuthor(target.value);
    else if (field === "text") setText(target.value);
  }

  const handleClick = () => {
    props.socket.emit('chatEvent', { author: author, text: text, time: new Date() });
    setAuthor("");
    setText("");
  }

  return (
    <div id="inputForm">
      <input type="text" name="author" onChange={(e) => { handleChange(e, "author") }} value={author} />
      <input type="text" name="text" onChange={(e) => { handleChange(e, "text") }} value={text} />
      <input type="button" value="Send" onClick={handleClick} />
    </div>
  )
}