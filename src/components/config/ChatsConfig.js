

export const getSender = (user, users) => {
    if (users.length >= 2) { // Controlla se ci sono almeno due utenti nella chat.
        return users[0]._id === user._id ? users[1].name : users[0].name;
    }

    return ""
}
// restituisce il nome del mittente della chat in base all'utente corrente (user) e all'array degli utenti partecipanti alla chat (users).
export const getSenderFull=(user, users)=>{
    return users[0]._id===user._id ? users[1] :users[0]
}
export const sameSender=(messages, m, i, userId)=>{
    return(
        i < messages.length -1 &&
        (messages[i+1].sender._id !== m.sender._id ||
        messages[i+1].sender._id===undefined) &&
            messages[i].sender._id !==userId)
}
export const lastMessage=(messages, m, i, userId)=>{
    return(
        i === messages.length -1 &&
        messages[messages.length-1].sender._id !==userId &&
        messages[messages.length-1].sender._id)
}
// Restituisce il margine sinistro o destro del messaggio in base all'utente mittente

export const sameSenderMargin = (messages, message, index, userId) => {
    const senderId = message.sender._id;
    const previousMessage = messages[index - 1];

    if (!previousMessage) {
        return 0;
    }

    const previousSenderId = previousMessage.sender._id;

    if (senderId === userId && previousSenderId === userId) {
        return 0; // Messaggio di richiesta dello stesso utente, senza margine sinistro
    } else if (senderId !== userId && previousSenderId !== userId) {
        return 0; // Messaggio di risposta di un altro utente, senza margine sinistro
    }

    return 50; // Altri casi, margine sinistro di 50px
};


export const sameUser = (messages, message, index, userId) => {
    const senderId = message.sender._id;
    const previousMessage = messages[index - 1];

    if (!previousMessage) {
        return false;
    }

    const previousSenderId = previousMessage.sender._id;

    return senderId === previousSenderId;
};
// Restituisce true se il messaggio è dello stesso utente del messaggio precedente