import { useChatState} from "../../Context/ChatProvider";
import {Box} from "@mui/material";
import SingleChat from "./SingleChat";


function ChatBox({fetchAgain, setFetchAgain}){
    const {selectedChat}= useChatState()
    return(
        <Box
        display={{base:selectedChat ? "flex":"none", md:"flex"}}
        alignItems="center" flexdir="column" padding={3} width={{base:"100%", md:"68%"}}
        borderRadius={13}  backgroundColor="white">
           <SingleChat  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
     </Box>
    )
}
export default ChatBox