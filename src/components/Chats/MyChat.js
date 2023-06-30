import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, Snackbar, Stack, Typography} from "@mui/material";
import axios from "axios";
import { useChatState } from "../../Context/ChatProvider";
import { getSender } from "../config/ChatsConfig";
import Friends from "./Friends";

function MyChat({ fetchAgain, setFetchAgain }) {
    const { selectedChat, setSelectedChat, chats, user, setChats } = useChatState();
    const [openSnackBar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const fetchChats = async () => {
        try {
            setIsLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("http://localhost:8080/api/chat", config);


            const friendsFromLocalStorage = JSON.parse(localStorage.getItem("friends"));

            const friendChats = data.filter((chat) =>
                chat.users.some((chatUser) => friendsFromLocalStorage.includes(chatUser._id))
            );

            localStorage.setItem("chats", JSON.stringify(friendChats));

            // Aggiorna le chat visualizzate
            setChats(friendChats);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const friendsFromLocalStorage = JSON.parse(localStorage.getItem("friends"));
        if (friendsFromLocalStorage) {
            // Verifica se sono presenti chat salvate nella localStorage
            const savedChats = JSON.parse(localStorage.getItem("chats"));
            if (savedChats && savedChats.length > 0) {
                setChats(savedChats);
            } else {
                fetchChats();
            }
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
                    <Friends fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchChats={fetchChats}>
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
                    overflowy="hidden"
                    backgroundColor="#F8F8F8"
                >
                    {isLoading ? ( // Mostra il caricamento delle chat se isLoading è true
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress />
                        </Box>
                    ) : (
                        // Mostra le chat solo se isLoading è false
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
                    )}
                </Box>
            </Box>

            <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={handleCloseSnackbar} message="Errore" />
        </>
    );
}

export default MyChat;

