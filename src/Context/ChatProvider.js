import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromLocalStorage } from "../utils/localStorage";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [chats, setChats] = useState([]);
    const [friendsList, setFriendsList]=useState([])
    const [notifications, setNotifications]=useState([])


    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = getUserFromLocalStorage("user");
        setUser(loggedInUser);
        if (!loggedInUser) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                chats,
                setChats,
                friendsList,
                setFriendsList,
                notifications,
                setNotifications
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

const useChatState = () => {
    return useContext(ChatContext);
};

export { ChatProvider, useChatState };