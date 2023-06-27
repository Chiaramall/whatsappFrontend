import { Avatar, Button, Modal, Typography, Grid } from "@mui/material";
import { useState } from 'react';
import { useChatState } from "../../Context/ChatProvider";

function Profile({ user, children }) {
    const [open, setOpen] = useState(false); // Inizializza open a 'false'

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {children ? (
                <span onClick={handleOpen}>{children}</span> // Usa handleOpen per aprire il modal
            ) : null}

            <Modal open={open} onClose={handleClose}>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        position: 'absolute',
                        top: '30%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        padding: '20px',
                        minWidth: '300px',
                        maxWidth: '500px',
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 1, textAlign: 'center', color: 'blue' }}>
                        {user.name}
                    </Typography>
                    <Grid item>
                        <Avatar src={user.pic} sx={{ width: 100, height: 100, mb: 2 }} alt={user.name} ></Avatar>
                    </Grid>
                    <Typography sx={{ mb: 2, textAlign: 'center', color: 'blue' }}>
                        {user.email}
                    </Typography>
                </Grid>
            </Modal>
        </>
    );
}

export default Profile;
