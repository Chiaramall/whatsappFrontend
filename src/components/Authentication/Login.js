
import { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography, Stack, TextField, Button, IconButton, InputAdornment,
    Snackbar, Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState, useChatState } from "../../Context/ChatProvider";
import { addUserToLocalStorage, getUserFromLocalStorage } from "../../utils/localStorage";

function Login() {
    const navigate = useNavigate();
const {setFriendsList}=useChatState()
    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState({
        email: "",
        password: "",
        loading: false,
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


        const handleSubmit = async (e) => {
            e.preventDefault();
            setValues({ ...values, loading: true });
            const { email, password } = values;
            if (!email || !password) {
                setSnackbarSeverity('error');
                setSnackbarMessage('Compila tutti i campi.');
                setSnackbarOpen(true);
                setValues({ ...values, loading: false });
                return;
            }
            try {
                const { data } = await axios.post('http://localhost:8080/api/user/login', {
                    email,
                    password,
                });
                setSnackbarSeverity('success');
                setSnackbarMessage('Login effettuato con successo');
                setSnackbarOpen(true);
                addUserToLocalStorage(data);

                // Recupera le informazioni sugli amici
                try {
                    const response = await axios.get('http://localhost:8080/api/friends', {
                        headers: {
                            Authorization: `Bearer ${data.token}`,
                        },
                    });
                    const friends = response.data.friends;
                    localStorage.setItem('friends', JSON.stringify(friends));
                    setFriendsList(friends);
                    // Utilizza le informazioni sugli amici come desiderato
                } catch (error) {
                    console.error('Errore nel recupero degli amici:', error);
                    // Gestisci l'errore del recupero degli amici
                }

                setTimeout(() => {
                    navigate('/chats');
                }, 1000);
                setValues({ ...values, loading: false });
            } catch (error) {
                setSnackbarSeverity('error');
                setSnackbarMessage('Errore nel login, password o email errate.');
                setSnackbarOpen(true);
                setValues({ ...values, loading: false });
                console.log(error);
            }
        };

        useEffect(() => {
            const loggedInUser = getUserFromLocalStorage('user');
            if (loggedInUser) {
                navigate('/chats');
            } else {
                // Utente non loggato, recupera le informazioni sugli amici
                const storedFriends = localStorage.getItem('friends');
                if (storedFriends) {
                    const friends = JSON.parse(storedFriends);
                    setFriendsList(friends);
                    // Utilizza le informazioni sugli amici come desiderato
                }
            }
        }, [navigate]);

        // ..


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                justifyContent="center"
                padding="3px"
                backgroundColor="white"
                borderRadius="lg"
                borderWidth="1px"
                margin="40px 0 15px 0"
            >
                <Typography variant="h4" color="blue">
                    Login
                </Typography>
            </Box>
            <Box backgroundColor="white" borderRadius="lg" borderWidth="1px" padding="20px">
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            fullWidth
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Login
                        </Button>
                    </Stack>
                </form>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
}

export default Login;
