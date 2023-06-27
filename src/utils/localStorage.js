export const addUserToLocalStorage = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};
export const getUserFromLocalStorage = () => {
    const result = localStorage.getItem("user");
    const user = result ? JSON.parse(result) : null;
    return user;
};
export const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
};
export const removeChatsFromLocalStorage = () => {
    localStorage.removeItem("chats");
};
export const removeFriends = () => {
    localStorage.removeItem("friendsList");
};








