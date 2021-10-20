import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const validateEmail = (email: string) => {
    if (!email.includes("@")) return false;
    return true;
  }

  const handleChange = (setState: any) => {
    return (e: any) => {
      setState(e.target.value);
    }
  }

  const handleClick = async () => {
    const res = await axios.post("http://localhost:9000/users/login", {
      email: email,
      password: password
    },
      { withCredentials: true }
    );
    console.log(res);
  }

  return (
    <div id="loginForm">
      Email &nbsp;
      <input type="text" name="email" onChange={handleChange(setEmail)} /><br />
      Password &nbsp;
      <input type="text" name="password" onChange={handleChange(setPassword)} /><br /><br />
      <input type="button" value="로그인" />
    </div>
  )
}

export default LoginForm