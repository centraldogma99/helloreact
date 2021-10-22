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

const serverAddr = "http://ec2-18-116-38-81.us-east-2.compute.amazonaws.com/"

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

  // 입력 검증, 간편함을 위해 어떠한 이유로 검증이 실패했는지까지는 구현 x
  const validate = (loginInfo: loginInfo) => {
    return !(!loginInfo.email.includes('@') || !loginInfo.email.includes('.') ||
      loginInfo.name === "" ||
      loginInfo.password.length < 8)
  }

  // 텍스트박스 내용 바뀔때 state바꾸기
  const handleChange = (setState: any) => {
    return (e: any) => {
      setState(e.target.value);
    }
  }

  // 로그인 버튼 또는 등록 버튼이 눌렸을 때의 동작
  const handleLoginClick = async (isRegister: boolean) => {
    setStatusText("");
    if (!isRegister) {
      const res = await axios.post(serverAddr + "/users/login", {
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
        setStatusText("Login failed, Error : " + res.data);
        setEmail(""); setPassword("");
      }
    } else {
      if (validate({ name: name, email: email, password: password })) {
        const res = await axios.post(serverAddr + "/users/register", {
          name: name,
          email: email,
          password: password
        }).catch((e) => e.response);
        if (res.status === 200) {
          setStatusText("Register successful");
        } else {
          setStatusText("Register failed, Error : " + res.data)
        }
      } else {
        setStatusText("입력값이 잘못되었습니다.");
      }
      setPassword("");
      setName("");
      setEmail("");
      setIsRegister(false);
    }
  }

  const handleRegisterClick = () => {
    setIsRegister(true);
  }

  const handleLogoutClick = async () => {
    await axios.get(serverAddr + "/users/logout", { withCredentials: true });
    setName("");
    setEmail("");
    setPassword("");
    setIsLoginSuccessful(false);
  }

  return (
    <>
      {isLoginSuccessful &&
        <div id="loginInfo">
          <small>Logged In as </small> <b>{localStorage.getItem('user')}</b> &nbsp;
          <input type="button" value="Logout" onClick={() => { handleLogoutClick() }} />
        </div>
      }
      <div className="lineBreak" />
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