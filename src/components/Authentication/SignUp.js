import { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography,
    Stack,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Snackbar, Alert, FormLabel, FormControl, Input
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import { ChatState, useChatState } from "../../Context/ChatProvider";
import { addUserToLocalStorage, getUserFromLocalStorage } from "../../utils/localStorage";

function SignUp() {
    const navigate = useNavigate();
    const [pic, setPic] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowconfirmPassword] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");
    const { setUser } = useChatState();


    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleToggleConfirmPasswordVisibilty = () => {
        setShowconfirmPassword(!showconfirmPassword);
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        pic:""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, passwordConfirm } = values;

        if (!name || !email || !password || !passwordConfirm) {
            setSnackbarSeverity("error");
            setSnackbarMessage("Please fill in all the fields.");
            setSnackbarOpen(true);
            setValues({ ...values, loading: false });
            return;
        }

        if (password !== passwordConfirm) {
            setSnackbarSeverity("error");
            setSnackbarMessage("Passwords do not match.");
            setSnackbarOpen(true);
            setValues({ ...values, loading: false });
            return;
        }

        try {
            const { data } = await axios.post("http://localhost:8080/api/user", {
                name,
                email,
                password,
                passwordConfirm,
                pic,
            });

            addUserToLocalStorage(data);
            navigate("/chats");
            setSnackbarSeverity("success");
            setSnackbarMessage("Registration completed successfully.");
            setSnackbarOpen(true);
            setValues({ ...values, loading: false });
        } catch (error) {
            setSnackbarSeverity("error");
            setSnackbarMessage("Error in registration, incorrect password or email.");
            setSnackbarOpen(true);
            setValues({ ...values, loading: false });
        }
    };

    useEffect(() => {
        const loggedInUser = getUserFromLocalStorage("user");
        if (loggedInUser) {
            navigate("/chats");
        }
    }, [navigate]);





return (
    <div>
    <ToastContainer/>
        <Container maxWidth="sm">
            <Box display="flex" justifyContent="center" padding="3px" backgroundColor="white" borderRadius="lg" borderWidth="1px" margin="40px 0 15px 0">
                <Typography variant="h4" color="blue">
                    Registration
                </Typography>
            </Box>
            <Box backgroundColor="white" borderRadius="lg" borderWidth="1px" padding="20px">
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField label="Name" onChange={(e) => setValues({ ...values, name: e.target.value })} fullWidth required />
                        <TextField label="Email" onChange={(e) => setValues({ ...values, email: e.target.value })} fullWidth required />
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
                        <TextField
                            label="Confirm Password"
                            type={showconfirmPassword ? "text" : "password"}
                            onChange={(e) => setValues({ ...values, passwordConfirm: e.target.value })}
                            fullWidth
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleToggleConfirmPasswordVisibilty} edge="end">
                                            {showconfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControl>
                            <FormLabel>Upload Pic</FormLabel>
                            <Input
                                type="file"
                                multiple={false}
                                onChange={(event) => {
                                    const imageFile = event.target.files[0];
                                    setValues({ ...values, pic: imageFile });
                                }}
                            />
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Register
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
    </div>
    );
}

export default SignUp;
