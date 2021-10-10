import React from "react";
// import logo from "./logo.svg";
import "./App.css";
// import { TodoList } from "./todolist/Todolist";
import { Chatting } from "./chatting/Chatting"
import { EnterChat } from "./chatting/EnterChat";


function App() {
  // const socket = io("http://localhost:9000");
  // socket.emit('randomEvent', "hello");
  return (
    <div className="App">
      <h1>채팅채팅!!</h1>
      <EnterChat />
    </div>
  );
}

export default App;
