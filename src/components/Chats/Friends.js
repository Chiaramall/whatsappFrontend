import React, { useEffect, useState } from "react";
import {
    Alert, Box,
    CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, Grid, Input, Snackbar, Stack, Tab, Tabs,
    Typography,
} from "@mui/material";
import axios from "axios";
import FriendsListItem from "../User/FriendListItem";
import UserListItem from "../User/UserListItem";
import { useChatState} from "../../Context/ChatProvider";




function Friends({ children, fetchAgain, setFetchAgain, fetchChats }) {
    const [openModal, setOpenModal] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
const [severitySnackbar, setSeveritySnackbar]=useState("success")
    const [snackbarMessage, setSnackbarMessage]=useState("")

    const [snackbarOpen, setSnackbarOpen]=useState(false)

    const { user, chats, setChats, friendsList,setFriendsList, setSelectedChat} = useChatState();


    const getFriendsFromStorage = () => {
        const storedFriends = localStorage.getItem("friends");
        if (storedFriends) {
            try {
                const friends = JSON.parse(storedFriends);
                return friends;
            } catch (error) {
                console.error("Errore durante il parsing della stringa JSON degli amici:", error);
            }
        }
        return []; // Ritorna un array vuoto se la stringa non è definita o non è un JSON valido
    };


// Funzione per salvare la lista degli amici nel localStorage
    const saveFriendsToStorage = (friends) => {
        localStorage.setItem('friends', JSON.stringify(friends));
    };
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
            localStorage.setItem("friends", JSON.stringify(data.friends));
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }

                const { data } = await axios.post(
                    "http://localhost:8080/api/chat",
                    { userId },
                    config
                );

                setSelectedChat(data);
                // Aggiorna la chat selezionata

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
                "http://localhost:8080/api/friends/remove",
                { userId: user._id, friendId: friend._id },
                config
            );

            // Aggiorna lo stato locale rimuovendo l'amico dalla lista degli amici
            setFriendsList((prevFriendsList) =>
                prevFriendsList.filter((u) => u._id !== friend._id)
            );
            setFetchAgain(!fetchAgain)
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
            setSeveritySnackbar("error")
            setSnackbarMessage("errore nella ricerca")
            setSnackbarOpen(true)
        }
    };


    const handleSubmit = async (friend) => {
        if (friendsList.length > 0 && friendsList.find((u) => u._id === friend._id)) {
            setSeveritySnackbar("error");
            setSnackbarMessage("Amico già aggiunto alla lista");
            setSnackbarOpen(true);
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
            setFriendsList([...friendsList, friend]);
            setSeveritySnackbar("success");
            setSnackbarMessage("Amico aggiunto con successo");
            setSnackbarOpen(true);

            // Rimuovi l'amico dalla lista delle chat normali
            const updatedChats = chats.filter((chat) => {
                const friendIndex = chat.users.findIndex((user) => user._id === friend._id);
                return friendIndex === -1;
            });
            setChats(updatedChats);
         // Aggiorna la lista delle chat normali
            setLoading(false);
        } catch (error) {
            console.error(error);
            setSeveritySnackbar("error");
            setSnackbarMessage("Errore");
            setSnackbarOpen(true);
            setLoading(false);
            console.log(error)
        }
    };


//effetto solo al montaggio del componente
    useEffect(() => {
        // Recupera la lista degli amici dal localStorage
        const storedFriends = getFriendsFromStorage();
        setFriendsList(storedFriends);
    }, []);

// ...

//  il localStorage si aggiorna quando la lista degli amici cambia
    useEffect(() => {
        saveFriendsToStorage(friendsList);
    }, [friendsList]);


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





