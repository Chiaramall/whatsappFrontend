import {Avatar, Box, Typography} from "@mui/material";


function FriendsRequests({user, handleRequest}){
    return(
        <>
            <Box
                onClick={handleRequest}
                cursor="pointer"
                backgroundColor="#B2DFDB"
                _hover={{ background: "#38B2AC", color: "white" }}
                width="100%"
                padding="8px"
                borderRadius="8px"
                marginBottom="8px"
            >
                <Box display="flex" alignItems="center" marginBottom="4px">
                    <Avatar mr={2} size="sm" cursor="pointer" name={user.name} src={user.pic} />
                    <Box>
                        <Typography variant="subtitle1">{user.name}</Typography>
                        <Typography variant="body1">
                            <b>Email:</b> {user.email}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            )
            }
        </>
    )
}

export default FriendsRequests