export const addUserToLocalStorage = (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
};
export const getUserFromLocalStorage = () => {
    const result = sessionStorage.getItem("user");
    const user = result ? JSON.parse(result) : null;
    return user;
};
export const removeUserFromLocalStorage = () => {
    sessionStorage.removeItem("user");
};
export const removeChats = () => {
    sessionStorage.removeItem("chats");
};
export const removeFriends = () => {
    sessionStorage.removeItem("friendsList");
};
export const removeMessage = () => {
    sessionStorage.removeItem("messages");
};

export const saveChatsToLocalStorage = (chats) => {
    const chatsJSON = JSON.stringify(chats);
    sessionStorage.setItem("chats", chatsJSON);
};


export const getChatsFromLocalStorage = () => {
    const result = sessionStorage.getItem("chats");
    const chats = result ? JSON.parse(result) : [];
    return chats;
};
export const saveMessagesToLocalStorage = (messages) => {
    const mess = JSON.stringify(messages);
    sessionStorage.setItem("messages", mess);
};


export const getMessagesFromLocalStorage = () => {
    const result = sessionStorage.getItem("messages");
    const messages = result ? JSON.parse(result) : [];
    return messages;
};
