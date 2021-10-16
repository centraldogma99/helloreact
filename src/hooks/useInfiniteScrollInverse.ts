// FIXME scrollLength 사용하도록

import { useState, useRef, useEffect } from "react";
import { chat } from "../chatting/types/chat"
import _ from "lodash";
import axios from "axios";

const chatServerAddr = 'http://localhost:9000/chats'

interface chatRes {
  data: chat[],
  page: number,
  totalPage: number,
  totalChats: number
}

const fetchData = (roomId: number, page: number) => {
  console.log("fetchData()")
  return axios.get(chatServerAddr, {
    params: {
      roomId: roomId,
      page: page
    }
  })
}

const getChatLength: (roomId: number) => Promise<{ chatLength: number }> = async (roomId: number) => {
  return axios.get(chatServerAddr + '/length', {
    params: {
      roomId: roomId
    }
  })
}

const useInfiniteScrollInverse = (roomId: number, scrollLength: number, scrollableElement: any) => {

}

export default useInfiniteScrollInverse;