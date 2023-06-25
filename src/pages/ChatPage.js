import axios from "axios";
import {useEffect, useState} from "react";

import {ChatState, useChatState} from '../Context/ChatProvider'
import {Box, Grid} from "@mui/material";
import SideBar from "../components/Chats/SideBar";
import ChatBox from "../components/Chats/ChatBox";
import MyChat from "../components/Chats/MyChat";


function ChatPage(){
    const [fetchAgain, setFetchAgain]=useState(false)
     const {user} =useChatState()


    return(
        <div style={{ width: '100%'}}>
            {user && <SideBar />}
              <Grid container display="flex" justifyContent="space-between" width="100%" height="91.5vh" padding="10px">
                  {user && <MyChat fetchAgain={fetchAgain} />}
                  {user && (
                      <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}

            </Grid>
        </div>
    )
}

export default ChatPage