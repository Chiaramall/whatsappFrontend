import {useEffect, useState} from "react";
import {
    Box,
    Button,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
    Grid,
    Avatar,
    MenuList,
    IconButton,
    SwipeableDrawer, Modal, Input, Snackbar, CircularProgress, Alert, Badge
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {Doorbell, DoorbellOutlined, ExpandMore, Notifications} from "@mui/icons-material";
import {ChatState, useChatState} from "../../Context/ChatProvider";
import React from 'react';
import Profile from "../Profile/Profile";
import UserListItem from '../User/UserListItem'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {
    getChatsFromLocalStorage, removeChats,
    removeFriends, removeMessage,
    removeUserFromLocalStorage,
    saveChatsToLocalStorage
} from "../../utils/localStorage";
import {getSender} from "../config/ChatsConfig";

function SideBar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false);
   const [snackbarSeverity, setSnackbarseverity]=useState("")
    const [snackbarMessage, setSnackbarMessage]=useState("")
    const [notificationCount, setNotificationCount] = useState(0);

    const [profileOpen, setProfileOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

// Aggiungi la funzione per gestire l'apertura del menu delle notifiche
    const [anchorElSearch, setAnchorElSearch] = useState(null);
    const [anchorElAvatar, setAnchorElAvatar] = useState(null);

    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false)
    const {
        user,
        setUser,
        setSelectedChat,
        selectedChat,
        chats,
        setChats,
        friendsList,
        setFriendsLIst,
        notifications,
        setNotifications
    } = useChatState();
    const [error, setError] = useState(false);



    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleSnackbarClos = () => {
        setError(false);
    };
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };


    const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] = useState(null);

// ...

    const handleNotificationMenuOpen = (event) => {
        setNotificationMenuAnchorEl(event.currentTarget);
        setNotificationCount(0); // Reset the notification count when the menu is opened
    };

    const handleSearchMenuClose = () => {
        setNotificationMenuAnchorEl(false);
        setNotificationCount(notificationCount + 1); // Increment the notification count
    };

    const handleNotificationMenuClose = () => {
        setNotificationMenuAnchorEl(false);}
    const openDrawer = () => {
        setIsOpen(true);
    };

    const closeDrawer = () => {
        setIsOpen(false);
    };


    const handleProfileOpen = () => {
        setProfileOpen(true);

    };
    const initials = user.name
        .split(' ')
        .map((name) => name.charAt(0))
        .join('');

    const handleProfileClose = () => {
        setProfileOpen(false);
    };
    const handleSearchMenuOpen = (event) => {
        setAnchorElSearch(event.currentTarget);
    };



    const handleAvatarMenuOpen = (event) => {
        setAnchorElAvatar(event.currentTarget);
    };
    const hasProfileImage = !!user.pic; // Assume che user.pic sia l'URL dell'immagine del profilo

    const handleAvatarMenuClose = () => {
        setAnchorElAvatar(null);
    };


    const logoutHandler = () => {
        removeUserFromLocalStorage("user");
        removeFriends("friendsList")
        navigate("/");
    };


    const handleSearch = async () => {
        if (!search) {
           setSnackbarseverity("error")
            setSnackbarMessage("campo di ricerca vuoto")
            setOpenSnackbar(true)
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.get(`http://localhost:8080/api/user?search=${search}`, config);
            setLoading(false);


            // Aggiungi i nuovi risultati alla lista dei risultati di ricerca esistente
            setSearchResult(data);
        } catch (e) {
          setSnackbarseverity("error")
            setSnackbarMessage("errore nella ricerca")
            setOpenSnackbar(true)
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
            };

            // Verifica se l'utente è un amico
            const isFriend = friendsList.some((friend) => friend._id === userId);

            if (isFriend) {
                setSnackbarseverity("error")
                setSnackbarMessage("utente già presente fra gli amici")
                setOpenSnackbar(true)
                setLoadingChat(false);
                return;
            }

            // Verifica se la chat con l'utente selezionato è già presente nella lista delle chat
            const existingChat = chats.find((chat) =>
                chat.users.some((chatUser) => chatUser._id === userId)
            );

            if (existingChat) {
                setSelectedChat(existingChat); // Seleziona la chat esistente
            } else {
                // Chat non trovata, crea una nuova chat
                const { data } = await axios.post(
                    "http://localhost:8080/api/chat",
                    { userId },
                    config
                );
                setSnackbarseverity("success")
                setSnackbarMessage("utente aggiunto alla lista delle chat")
                setOpenSnackbar(true)

                setSelectedChat(data); // Aggiorna la chat selezionata

                const updatedChats = [data, ...chats]; // Aggiungi la nuova chat alla lista delle chat
                setChats(updatedChats);
            }

            setLoadingChat(false);
            closeDrawer();
        } catch (error) {
            setSnackbarseverity("error")
            setSnackbarMessage("errore")
            setOpenSnackbar(true)
            setLoadingChat(false);
        }
    };

    useEffect(() => {
        // Aggiorna il conteggio delle notifiche quando la prop `notifications` cambia
        setNotificationCount(notifications.length);
    }, [notifications]);

    useEffect(() => {
        // Apri il menu delle notifiche se ci sono nuove notifiche
        if (notifications.length > 0) {
            setNotificationMenuAnchorEl(true);
        }
    }, [notifications]);




    return (
        <div>
        <Grid
            container
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            backgroundColor="white"
            width="100%"
            padding="5px 10px"
            border="3px"
            borderRadius={11}
            boxShadow="0px 0px 4px 2px rgba(0, 0, 255, 0.5)"
        >
            <Tooltip title="search users" placement="bottom-end">
                <Button variant="ghost" endIcon={<SearchIcon/>} onClick={openDrawer}>
                    <Typography>Search users</Typography>
                </Button>
            </Tooltip>

            <Typography color="blue" variant="h5">
                Chat App
            </Typography>

            <div>
                <Button
                    onClick={handleNotificationMenuOpen}
                >
                    <Badge badgeContent={notificationCount} color="secondary">
                        <Notifications />
                    </Badge>
                </Button>

                <Menu
                    id="search-menu"
                    anchorEl={notificationMenuAnchorEl}
                    keepMounted
                    open={Boolean(notificationMenuAnchorEl)}  // Usa lo stato per gestire l'apertura del menu delle notifiche
                    onClose={handleNotificationMenuClose}
                >
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <MenuItem
                                key={notif._id}
                                onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotifications(notifications.filter((n) => n !== notif));
                                    handleSearchMenuClose();
                                }}
                            >
                                {`New Message from ${getSender(user, notif.chat.users)}`}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem >No new messages</MenuItem>
                    )}
                </Menu>

                <Button
                    aria-controls="avatar-menu"
                    aria-haspopup="true"
                    onClick={handleAvatarMenuOpen}
                >
                    <Avatar size="small" cursor="pointer" name={user.name}>
                        {hasProfileImage ? (
                            <img src={user.pic} alt="Profile"/>
                        ) : (
                            initials
                        )}
                    </Avatar>

                    <ExpandMore/>
                </Button>

                <Menu
                    id="avatar-menu"
                    anchorEl={anchorElAvatar}
                    keepMounted
                    open={Boolean(anchorElAvatar)}
                    onClose={handleAvatarMenuClose}
                >
                    <Profile user={user} onClose={handleProfileClose} >
                        <MenuItem onClick={handleProfileOpen}>My profile</MenuItem></Profile>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>


                </Menu>
            </div>
        </Grid>

    <SwipeableDrawer open={isOpen} onClose={closeDrawer}>
        <div className="drawer-content" style={{width: '300px', maxWidth: '100%'}}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <div style={{marginBottom: '20px'}}>
                    <Input
                        placeholder="Cerca per nome o email"
                        style={{width: '100%', padding: '10px'}}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Cerca
                </Button>
            </Box>

            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={200}
                >
                    <CircularProgress/>
                </Box>
            ) : (
                searchResult?.map((u) => (
                    <UserListItem
                        key={u._id}
                        user={u}
                        handleFunction={() => accessChat(u._id)}
                    />
                ))
            )}
            {loadingChat && <CircularProgress display="flex"/>}
        </div>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
    </SwipeableDrawer>
        </div>

)
}
export default SideBar