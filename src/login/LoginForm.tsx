/*
  login/register를 할 수 있는 폼
  로그인 성공시 채팅 로드
*/

import React, { useState, useRef } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { EnterChat } from "../chatting/EnterChat";
import Cookies from 'js-cookie';
import { useEffect } from "react";

type loginInfo = {
  name: string,
  email: string,
  password: string
}

const LoginForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");

  useEffect(() => {
    console.log('useEffect()')
    console.log(localStorage.getItem('user'));
    console.log(Cookies.get('credential'))
    if (localStorage.getItem('user') && Cookies.get('credential')) setIsLoginSuccessful(true);
  }, [])

  const validate = (loginInfo: loginInfo) => {
    return !(!loginInfo.email.includes('@') || !loginInfo.email.includes('.') ||
      loginInfo.name === "" ||
      loginInfo.password.length < 8)
  }

  const handleChange = (setState: any) => {
    return (e: any) => {
      setState(e.target.value);
    }
  }

  const handleLoginClick = async (isRegister: boolean) => {
    if (!isRegister) {
      const res = await axios.post("http://localhost:9000/users/login", {
        email: email,
        password: password
      },
        { withCredentials: true }
      );
      console.log(res);
      if (res.status === 200) {
        setIsLoginSuccessful(true);
        localStorage.setItem('user', (res as any).data.email)
        return;
      }
    } else {
      console.log("registering")
      if (validate({ name: name, email: email, password: password })) {
        const res = await axios.post("http://localhost:9000/users/register", {
          name: name,
          email: email,
          password: password
        });
        console.log(res);
        setIsRegister(false);
      } else {
        setStatusText("입력값이 잘못되었습니다.");
        setPassword("");
        setName("");
        setEmail("");
      }
    }
  }

  const handleRegisterClick = () => {
    setIsRegister(true);
  }

  return (
    <>
      {(!isLoginSuccessful) &&
        <div id="loginForm">
          {isRegister && <>
            Name &nbsp;
            <input type="text" name="name" value={name} onChange={handleChange(setName)} /><br />
          </>}
          Email &nbsp;
          <input type="text" name="email" value={email} onChange={handleChange(setEmail)} /><br />
          Password &nbsp;
          <input type="text" name="password" value={password} onChange={handleChange(setPassword)} /><br /><br />
          {statusText} <br />
          <input type="button" value={isRegister ? "등록" : "로그인"} onClick={() => { handleLoginClick(isRegister) }} /><br /><br />
          {!isRegister && <input type="button" value="Register" onClick={() => { handleRegisterClick() }} />}
        </div>
      }
      {isLoginSuccessful && <EnterChat />}
    </>
  )
}

export default LoginForm