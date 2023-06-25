import React, { useEffect, useState } from "react";
import {
    Box,
    Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, Grid, Input, Snackbar, Stack, Tab, Tabs, Typography,
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
    const [openSnackErrorbar, setErrorSnackBar] = useState(false);
    const [openUserSnackBsr, setUserSnackBar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user, chats, setChats, friendsList,setFriendsList,selectedChat, setSelectedChat} = useChatState();





const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

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

            // Cerca la chat con l'utente selezionato nella lista delle chat
            const existingChat = chats.find((chat) =>
                chat.users.some((chatUser) => chatUser._id === userId)
            );

            if (existingChat) {
                setSelectedChat(existingChat); // Apri la chat esistente
            } else {
                const { data } = await axios.post(
                    "http://localhost:8080/api/chat",
                    { userId },
                    config
                );

                setSelectedChat(data); // Aggiorna la chat selezionata
            }

            setLoadingChat(false);

            handleCloseModal(); // Chiudi la modale dopo aver selezionato/aperto la chat
        } catch (error) {
            console.error(error);
            setErrorSnackBar(true);
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
                "http://localhost:8080/api/friends/remove",
                { userId: user._id, friendId: friend._id },
                config
            );

            // Aggiorna lo stato locale rimuovendo l'amico dalla lista degli amici
            setFriendsList((prevFriendsList) =>
                prevFriendsList.filter((u) => u._id !== friend._id)
            );

            // Rimuovi l'amico dalla lista delle chat solo se è presente
            const updatedChats = chats.filter(
                (chat) => chat.users.every((chatUser) => chatUser._id !== friend._id)
            );
            setChats(updatedChats);

            // Aggiorna il valore nel localStorage dopo la rimozione dell'amico
            const storedFriendsList = sessionStorage.getItem("friendsList");
            if (storedFriendsList) {
                const parsedFriendsList = JSON.parse(storedFriendsList);
                const updatedFriendsList = parsedFriendsList.filter((u) => u._id !== friend._id);
                sessionStorage.setItem("friendsList", JSON.stringify(updatedFriendsList));
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
                `http://localhost:8080/api/user?search=${search}`,
                config
            );

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setErrorSnackBar(true);
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
                "http://localhost:8080/api/friends",
                config
            );
            setFriendsList(data.friends);

            // Salva la lista degli amici nel localStorage
            sessionStorage.setItem("friendsList", JSON.stringify(data.friends));

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Recupera la lista degli amici dal localStorage se presente
        const storedFriendsList = sessionStorage.getItem("friendsList");
        if (storedFriendsList) {
            setFriendsList(JSON.parse(storedFriendsList));
        } else {
            getFriendsList();
        }
    }, []);



    const handleSubmit = async (friend) => {
        if (friendsList.length > 0 && friendsList.find((u) => u._id === friend._id)) {
            console.log("Errore: Amico già presente nella lista");
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
                "http://localhost:8080/api/friends/add",
                { _id: user._id, friendId: friend._id },
                config
            );

            // Aggiorna la lista degli amici
            await getFriendsList(); // Recupera la lista aggiornata dal backend server

            // Rimuovi l'amico dalla lista delle chat solo se è presente nella lista
            const updatedChats = chats.filter(
                (chat) =>
                    chat.users.every((chatUser) => chatUser._id !== friend._id) &&
                    !chat.isFriend
            );
            setChats(updatedChats);
           saveChatsToLocalStorage(updatedChats);// Salva le informazioni sulla chat nel localStorage

            setLoading(false);
        } catch (error) {
            console.error(error);
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
                        <Tab label="Friend List" />
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

            <Snackbar
                open={openSnackErrorbar}
                autoHideDuration={3000}
                onClose={() => setErrorSnackBar(false)}
                message="Errore nella ricerca"
            />

            <Snackbar
                open={openUserSnackBsr}
                autoHideDuration={3000}
                onClose={() => setUserSnackBar(false)}
                message="Utente già presente"
            />
        </>
    );
}

export default Friends;





