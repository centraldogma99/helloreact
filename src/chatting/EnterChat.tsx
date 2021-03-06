import React, { useState } from "react";
import { Chatting } from "./Chatting";
import _ from "lodash"

export const EnterChat = () => {
  const [roomId, setRoomId] = useState<any>();
  const [statusMessage, setStatusMessage] = useState<string>("");
  // const [username, setUsername] = useState<string>("");
  const [isRoomEntered, setIsRoomEntered] = useState<boolean>(false);

  // const validateUsername = (name: string) => {
  //   if (name.includes("ugly")) return { res: false, message: "닉네임에 ugly를 포함할 수 없습니다." };
  //   else if (name === "") return { res: false, message: "닉네임이 공백일 수 없습니다." }
  //   else return { res: true, message: "" };
  // }

  const validateRoomId = (id: any) => {
    let res = false;
    let message = "";
    if (isNaN(id)) message = "방 번호는 숫자만 가능합니다.";
    else if (id === "") message = "방 번호를 적어주세요."
    else if (!Number.isInteger(Number(id)) || (id as number) <= 0) message = "방 번호는 양의 정수여야 합니다."
    else res = true;

    return { res: res, message: message }
  }

  const handleChangeRoomId = (e: any) => {
    const target = e.target as HTMLInputElement;
    const validateRes = validateRoomId(target.value as any)
    setStatusMessage(validateRes.message);
    setRoomId(target.value)
  }

  // const handleChangeUsername = (e: any) => {
  //   const target = e.target as HTMLInputElement;
  //   const validateRes = validateUsername(target.value as string)
  //   setStatusMessage(validateRes.message)
  //   setUsername(target.value);
  // }

  const handleClick = () => {
    // if (!validateRoomId(roomId).res || !validateUsername(username).res) return;
    if (!validateRoomId(roomId).res) return;
    else {
      setIsRoomEntered(true);
    }
  }

  const exitRoom = () => {
    setIsRoomEntered(false);
    setRoomId(null);
  }

  return (
    <div id="chat">
      {!isRoomEntered &&
        <>
          <p>
            방 번호&nbsp;&nbsp;
            <input type="text" name="roomId" onChange={handleChangeRoomId} value={roomId} />
            <input type="button" name="roomIdBtn" value="입장" onClick={_.throttle(handleClick, 200)} />
          </p>
        </>
      }

      <p>{statusMessage}</p>
      {isRoomEntered && <Chatting roomId={roomId} exitRoom={exitRoom} />}
    </div>
  )
}