import React, { useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
// import { TodoList } from "./todolist/Todolist";
import { Chatting } from "./chatting/Chatting"
import { EnterChat } from "./chatting/EnterChat";
import { Router, Route, Link } from "react-router-dom";
import LoginForm from "./login/LoginForm";
import { useEffect } from "react";
import Cookies from "js-cookie";


function App() {
  // const socket = io("http://localhost:9000");
  // socket.emit('randomEvent', "hello");

  return (
    <div className="App">
      <h1>채팅합시다</h1>
      <LoginForm />
    </div>
  );
}

export default App;
