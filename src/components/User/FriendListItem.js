import {Avatar, Box, Button, Typography} from "@mui/material";
import {Close} from "@mui/icons-material";
import {ChatState} from "../../Context/ChatProvider";


import React from "react";


function FriendsListItem({ friend, handleFunction, accessChat }) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding={2}
            marginBottom={2}
            borderRadius="13px"
            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
            backgroundColor="#F8F8F8"
            width="calc(100% - 24px)"
            maxWidth="500px"

        >
            <Box flexGrow={1} marginRight={2} onClick={accessChat}>
                {friend.name}
            </Box>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleFunction}
            >
                X
            </Button>

        </Box>
    );
}


export default FriendsListItem