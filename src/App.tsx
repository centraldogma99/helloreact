import React from "react";
// import logo from "./logo.svg";
import "./App.css";
// import { TodoList } from "./todolist/Todolist";
import { Chatting } from "./chatting/Chatting"
import { EnterChat } from "./chatting/EnterChat";
import { Router, Route, Link } from "react-router-dom";
import LoginForm from "./login/LoginForm";


function App() {
  // const socket = io("http://localhost:9000");
  // socket.emit('randomEvent', "hello");
  return (
    <div className="App">
      <h1>채팅채팅!!</h1>
      Logged In as <b>{localStorage.getItem('user')}</b>
      <LoginForm />
    </div>
  );
}

export default App;
