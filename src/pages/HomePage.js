import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from "react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useNavigate } from "react-router-dom";
import { useChatState } from "../Context/ChatProvider";
import {getUserFromLocalStorage} from "../utils/localStorage";

function HomePage() {

    const [currentTab, setCurrentTab] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (getUserFromLocalStorage("user")) {
            setTimeout(() => {
                navigate("/chats");
            }, 3000);
        }
    }, [navigate]);
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Container maxWidth="lg" justifyContent="center">
            <Box
                display="flex"
                justifyContent="center"
                padding="3px"
                backgroundColor="white"
                borderRadius="lg"
                borderWidth="1px"
                width="100%"
                margin="40px 0 15px 0"
            >
                <Typography variant="h4" color="blue">
                    ChatApp
                </Typography>
            </Box>
            <Box
                backgroundColor="white"
                borderRadius="lg"
                borderWidth="1px"
                width="100%"
                color="black"
            >

                    <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
                        <Tab label="Login" />
                        <Tab label="SignUp" />
                    </Tabs>

                {currentTab === 0 && <Login />}
                {currentTab === 1 &&  <SignUp />}
            </Box>
        </Container>
    );
}

export default HomePage;
