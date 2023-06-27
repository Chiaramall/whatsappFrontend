import React, { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    Input,
    Snackbar,
    Stack,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import axios from "axios";
import FriendsListItem from "../User/FriendListItem";
import UserListItem from "../User/UserListItem";
import {ChatState, useChatState} from "../../Context/ChatProvider";
import {saveChatsToLocalStorage} from "../../utils/localStorage";



function Friends({ children }) {
    const [openModal, setOpenModal] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
const [severitySnackbar, setSeveritySnackbar]=useState("")
    const [snackbarMessage, setSnackbarMessage]=useState("")

    const [snackbarOpen, setSnackbarOpen]=useState(false)

    const { user, chats, setChats, friendsList,setFriendsList,selectedChat, setSelectedChat} = useChatState();



    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


// ...
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // Verifica se l'utente è un amico
            const isFriend = friendsList.some((friend) => friend._id === userId);

            if (!isFriend) {
                setLoadingChat(false);
                return;
            }

            // Cerca la chat con l'utente selezionato nella lista delle chat tra gli amici
            const existingChat = friendsList.find((chat) =>
                chat.users.some((chatUser) => chatUser._id === userId)
            );

            if (existingChat) {
                setSelectedChat(existingChat); // Apri la chat esistente
            } else {
                const { data } = await axios.post(
                    "https://mern-chat-app-api-cmhy.onrender.com/api/chat",
                    { userId },
                    config
                );

                // Aggiorna la lista delle chat degli amici includendo la nuova chat
                setFriendsList((prevFriendChats) => [...prevFriendChats, data]);

                setSelectedChat(data);
                // Aggiorna la chat selezionata
            }

            setLoadingChat(false);

            handleCloseModal(); // Chiudi la modale dopo aver selezionato/aperto la chat
        } catch (error) {
            setSeveritySnackbar("error");
            setSnackbarMessage("errore")
            setSnackbarOpen(true)
            setLoading(false);
        }
    };





    const handleDelete = async (friend) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                "https://mern-chat-app-api-cmhy.onrender.com/api/friends/remove",
                { userId: user._id, friendId: friend._id },
                config
            );

            // Aggiorna lo stato locale rimuovendo l'amico dalla lista degli amici
            setFriendsList((prevFriendsList) =>
                prevFriendsList.filter((u) => u._id !== friend._id)
            );


            // Rimuovi l'amico dalla lista delle chat solo se è presente
            const updatedChats = chats.filter(
                (chat) =>
                    chat.users.every((chatUser) => chatUser._id !== friend._id)
            );
            setChats(updatedChats);

            // Rimuovi la chat selezionata se corrisponde all'amico rimosso
            if (selectedChat && selectedChat.users.some((chatUser) => chatUser._id === friend._id)) {
                setSelectedChat(null);
            }


            setLoading(false);
        } catch (error) {
            console.error(error);
            // Gestisci eventuali errori durante la richiesta
            setLoading(false);
        }
    };




    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `https://mern-chat-app-api-cmhy.onrender.com/api/user?search=${search}`,
                config
            );

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setSeveritySnackbar("error")
            setSnackbarMessage("errore nella ricerca")
            setSnackbarOpen(true)
        }
    };
    const getFriendsList = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                "https://mern-chat-app-api-cmhy.onrender.com/api/friends",
                config
            );
            setFriendsList(data.friends);



            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };




    const handleSubmit = async (friend) => {
        if (friendsList.length > 0 && friendsList.find((u) => u._id === friend._id)) {
            setSeveritySnackbar("error");
            setSnackbarMessage("amico già aggiunto alla lista");
            setSnackbarOpen(true)
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(
                "https://mern-chat-app-api-cmhy.onrender.com/api/friends/add",
                { _id: user._id, friendId: friend._id },
                config
            );
            setSeveritySnackbar("success")
            setSnackbarMessage("amico aggiunto con successo")
            setSnackbarOpen(true)
            // Aggiorna la lista degli amici
            await getFriendsList(); // Recupera la lista aggiornata dal backend server

            // Rimuovi l'amico dalla lista delle chat solo se è presente nella lista
            const updatedChats = chats.filter(
                (chat) =>
                    chat.users.every((chatUser) => chatUser._id !== friend._id) &&
                    !chat.isFriend
            );
            setChats(updatedChats);


            setLoading(false);
        } catch (error) {
            setSeveritySnackbar("error");
            setSnackbarMessage("errore")
            setSnackbarOpen(true)
            setLoading(false);
        }
    };







    return (
        <>
            <span onClick={handleOpenModal}>{children}</span>
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle display="flex" justifyContent="center">
                    Friends List
                </DialogTitle>
                <DialogContent>
                    <Tabs value={tabValue} onChange={handleTabChange} centered>
                        <Tab label="Friends List" />
                        <Tab label="Add Friends" />
                    </Tabs>
                    {tabValue === 0 && (
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
                            {friendsList?.length > 0 ? (
                                <Stack spacing={2} overflowy="scroll">
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        {friendsList.map((u) => (
                                            <FriendsListItem
                                                key={u._id}
                                                friend={u}
                                                handleFunction={() => handleDelete(u)}
                                                accessChat={() => accessChat(u._id)}

                                            />
                                        ))}
                                    </Box>
                                </Stack>
                            ) : (
                                <Typography align="center">No friends in the list.</Typography>
                            )}
                        </Box>
                    )}
                    {tabValue === 1 && (
                        <Box display="flex" flexDirection="column" alignItems="center">
                            {/* Contenuto per aggiungere nuovi amici */}
                            <Grid container direction="column" alignItems="center" marginTop="30px">
                                <Grid item>
                                    <FormControl>
                                        <Input
                                            placeholder="Search"
                                            onChange={(e) => handleSearch(e.target.value)}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    {loading ? (
                                        <div style={{ textAlign: "center" }}>
                                            <CircularProgress />
                                        </div>
                                    ) : (
                                        searchResult?.slice(0, 4).map((user) => (
                                            <UserListItem
                                                key={user._id}
                                                user={user}
                                                handleFunction={() => handleSubmit(user)
                                            }
                                            />
                                        ))
                                    )}
                                </Grid>
                            </Grid>
                            {/* <Box mt={2} display="flex" justifyContent="flex-end">
                <Button color="primary" onClick={handleSubmit}>
                  Add to List
                </Button>
              </Box>*/}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={severitySnackbar} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Friends;





