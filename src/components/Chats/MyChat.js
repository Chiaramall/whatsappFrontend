import React, {useEffect, useState} from "react";
import { Box, Button, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useChatState } from "../../Context/ChatProvider";
import { getSender } from "../config/ChatsConfig";
import Friends from "./Friends";
import {getChatsFromLocalStorage, getUserFromLocalStorage, saveChatsToLocalStorage} from "../../utils/localStorage";

function MyChat({ fetchAgain }) {
    const { selectedChat, setSelectedChat, chats, user, setChats, setUser } = useChatState();
const [openSnackBar, setOpenSnackbar]=useState(false);
const [loggedUser, setLoggedUser]=useState()
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };



    const [isLoading, setIsLoading] = useState(true);

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("http://localhost:8080/api/chat", config);
            setChats(data);
            setIsLoading(false); // Imposta isLoading su false dopo aver ottenuto i dati delle chat
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setUser(getUserFromLocalStorage("user"));
        if (isLoading) {
            fetchChats(); // Effettua la chiamata solo durante il caricamento iniziale
        }
    }, []);







    return (
        <>
            <Box
                display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
                flexDirection="column"
                alignItems="center"
                padding={3}
                backgroundColor="white"
                width={{ base: "100%", md: "25%" }}
                borderRadius={13}
            >
                <Box
                    paddingBottom={3}
                    paddingX={2}
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                    fontSize="30px"
                >
                    My Chats
                    <Friends>
                        <Button display="flex">Friends</Button>
                    </Friends>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    padding={3}
                    width="100%"
                    height="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                    backgroundColor="#F8F8F8"
                >
                    <Stack spacing={2} overflowY="scroll">
                        {chats?.map((chat) => (
                            <Box
                                key={chat._id}
                                onClick={() => {
                                    if (selectedChat === chat) {
                                        setSelectedChat(null);
                                    } else {
                                        setSelectedChat(chat);
                                    }
                                }}
                                cursor="pointer"
                                backgroundColor={selectedChat === chat ? "#A5D6A7" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                paddingX={3}
                                paddingY={2}
                                borderRadius={11}
                            >
                                <Typography>{getSender(user, chat?.users)}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Box>

            <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={handleCloseSnackbar} message="Errore" />
        </>
    );
}

export default MyChat;

