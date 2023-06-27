import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ScrollableChat from "./ScrollableChat";
import  {getSender, getSenderFull} from "../config/ChatsConfig";
import {ChatState, useChatState} from "../../Context/ChatProvider";
import {ArrowBack} from "@mui/icons-material";
import Profile from "../Profile/Profile";
import io from 'socket.io-client'
import {
    Box,
    CircularProgress,
    FormControl,
    Input,
    InputAdornment,
    InputBase,
    InputLabel,
    Paper,
    TextField
} from "@mui/material";
import './style.css';
import axios from "axios";
import {toast} from "react-toastify";
import {saveChatsToLocalStorage, saveMessagesToLocalStorage} from "../../utils/localStorage";
const ENDPOINT ="https://mern-chat-app-api-cmhy.onrender.com";
let socket, selectedChatCompare;

function SingleChat() {
    const { user, selectedChat, setSelectedChat, notifications, setNotifications , chats, setChats} = useChatState()
    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const [socketConnected, setSocketConnected]=useState(false)
    const [typing, setTyping]=useState(false)
    const [isTyping, setIsTyping]=useState(false)
    const [fetchAgain, setFetchAgain]=useState(false)



    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `https://mern-chat-app-api-cmhy.onrender.comapi/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "https://mern-chat-app-api-cmhy.onrender.com/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);



            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () =>{
            setSocketConnected(true)
            fetchMessages()
        });
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notifications.includes(newMessageRecieved)) {
                    setNotifications([newMessageRecieved, ...notifications]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    },);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };



    return (
        <>
            {selectedChat ? (
                <Grid container style={{ height: "100vh" }}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-start" alignItems="center">
                            <Grid item>
                                <IconButton onClick={() => setSelectedChat("")} marginRight="60px">
                                    <ArrowBack />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4" color="primary" paddingBottom={3} marginLeft="100px">
                                    {getSender(user, selectedChat.users)}
                                    <Profile user={getSenderFull(user, selectedChat.users)}></Profile>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        padding={2}
                        backgroundColor="#F5F5F5"
                        width="100%"
                        height="90%"
                        overflowY="hidden"
                        borderRadius={12}
                    >
                        {loading ? (
                            <CircularProgress width={20} height={20} marign="auto" />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages}/>
                            </div>
                        )}
                        <TextField
                            placeholder=  {isTyping ? "typing..." : "Enter a message..."}
                            variant="filled"
                            onChange={typingHandler}
                            value={newMessage}
                            onKeyDown={sendMessage}
                            required
                            fullWidth
                            sx={{
                                backgroundColor: "white",
                                borderRadius: "10px",
                            }}
                        />
                    </Box>
                </Grid>
            ) : (
                <Box display="flex" alignItems="center" height="100%">
                    <Typography variant="h4" align="center" style={{ marginLeft: "300px" }}>
                        Click on a user to start chatting
                    </Typography>
                </Box>
            )}
        </>
    );
}

export default SingleChat;


