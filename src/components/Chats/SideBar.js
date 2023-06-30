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
import { ExpandMore, Notifications} from "@mui/icons-material";
import { useChatState} from "../../Context/ChatProvider";
import React from 'react';
import Profile from "../Profile/Profile";
import UserListItem from '../User/UserListItem'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {
    removeUserFromLocalStorage,
} from "../../utils/localStorage";
import {getSender} from "../config/ChatsConfig";

function SideBar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarseverity]=useState("success")
    const [snackbarMessage, setSnackbarMessage]=useState("")
    const [notificationCount, setNotificationCount] = useState(0);

    const [profileOpen, setProfileOpen] = useState(false);


    const [anchorElAvatar, setAnchorElAvatar] = useState(null);

    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false)
    const {
        user,
        setSelectedChat,
        chats,
        setChats,
        friendsList,
        notifications,
        setNotifications
    } = useChatState();

const [notificationsMenu, setShowNotificationsMenu]=useState(false)
    const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] = useState(null);

// ...

    const handleOutsideClick = (event) => {
        const menu = document.getElementById("search-menu");
        if (menu && !menu.contains(event.target)) {
            setShowNotificationsMenu(false);
        }
    };
    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);
    const handleNotificationMenuOpen = (event) => {
        event.stopPropagation(); // stopPropagation per evitare la propagazione dell'evento
        setShowNotificationsMenu(true);
        setNotificationMenuAnchorEl(event.currentTarget);
        setNotificationCount(0); // Resetta conteggio delle notifiche quando il menu viene aperto
    };



    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };



    const handleNotificationMenuClose = () => {
        setShowNotificationsMenu(false)
        setNotificationMenuAnchorEl(null);}
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



    const handleAvatarMenuOpen = (event) => {
        setAnchorElAvatar(event.currentTarget);
    };
    const hasProfileImage = !!user.pic;

    const handleAvatarMenuClose = () => {
        setAnchorElAvatar(null);
    };


    const logoutHandler = () => {
        removeUserFromLocalStorage("user");
        localStorage.removeItem("friends")
        localStorage.removeItem("friendChats")
        localStorage.removeItem("chats")
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
                    <Badge badgeContent={notifications.length} color="secondary">
                        <IconButton onClick={handleNotificationMenuOpen}>
                            <Notifications color="blue"/>
                        </IconButton>
                    </Badge>


                    <Menu
                        id="search-menu"
                        anchorEl={notificationMenuAnchorEl}
                        keepMounted
                        open={notificationsMenu}
                        onClose={handleNotificationMenuClose}
                    >
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotifications(notifications.filter((n) => n !== notif));
                                    }}
                                >
                                    {`New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem>No new messages</MenuItem>
                        )}
                    </Menu>


                    <Button
                        aria-controls="avatar-menu"
                        aria-haspopup="true"
                        onClick={handleAvatarMenuOpen}
                    >
                        <Avatar size="small" cursor="pointer" src={user.pic}>
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