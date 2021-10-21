/*
  login/register를 할 수 있는 폼
  로그인 성공시 채팅 로드
*/

import React, { useState } from "react";
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
    console.log("useeffect()")
    console.log(Cookies.get('credential'));
    console.log(localStorage.getItem('user'))
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
      )
        .catch((e) => e.response);
      if (res.status === 200) {
        localStorage.setItem('user', (res as any).data.name);
        setIsLoginSuccessful(true);
        return;
      } else {
        setStatusText("Login failed, Error : " + res.data)
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

  const handleLogoutClick = async () => {
    await axios.get("http://localhost:9000/users/logout", { withCredentials: true });
    setName("");
    setEmail("");
    setPassword("");
    setIsLoginSuccessful(false);
  }

  return (
    <>
      {isLoginSuccessful && <>
        <p>Logged In as {localStorage.getItem('user')}</p>
        <input type="button" value="Logout" onClick={() => { handleLogoutClick() }} />
      </>}
      {!isLoginSuccessful &&
        <div id="loginForm">
          {isRegister && <>
            Name &nbsp;
            <input type="text" name="name" value={name} onChange={handleChange(setName)} /><br />
          </>}
          Email &nbsp;
          <input type="email" name="email" value={email} onChange={handleChange(setEmail)} /><br />
          Password &nbsp;
          <input type="password" name="password" value={password} onChange={handleChange(setPassword)} /><br /><br />
          <p>{statusText}</p>
          <input type="button" value={isRegister ? "등록" : "로그인"} onClick={() => { handleLoginClick(isRegister) }} /><br /><br />
          {!isRegister && <input type="button" value="Register" onClick={() => { handleRegisterClick() }} />}
        </div>
      }
      {isLoginSuccessful && <EnterChat />}
    </>
  )
}

export default LoginForm