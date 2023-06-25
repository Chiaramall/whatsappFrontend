import ScrollableFeed from "react-scrollable-feed";
import {sameSender, lastMessage, sameSenderMargin, sameUser} from '../config/ChatsConfig'
import {ChatState, useChatState} from "../../Context/ChatProvider";
import {Avatar, Tooltip} from "@mui/material";


function ScrollableChat({ messages }) {
    const { user } = useChatState();

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => {
                    const isSender = m.sender._id === user._id;
                    const bubbleStyle = {
                        backgroundColor: isSender ? "#DCF8C6" : "#ECE5DD",
                        color: isSender ? "black" : "inherit",
                        borderRadius: "20px",
                        padding: "8px 15px",
                        maxWidth: "75%",
                        wordBreak: "break-word",
                        alignSelf: isSender ? "flex-end" : "flex-start",
                    };

                    return (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-end",
                                marginBottom: "10px",
                                flexDirection: isSender ? "row-reverse" : "row",
                            }}
                            key={m._id}
                        >
                            {!isSender && (
                                <Tooltip
                                    label={m.sender.name}
                                    placement="bottom-start"
                                    hasArrow
                                >
                                    <Avatar
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                        style={{ marginRight: "5px" }}
                                    />
                                </Tooltip>
                            )}
                            <span style={bubbleStyle}>{m.content}</span>
                        </div>
                    );
                })}
        </ScrollableFeed>
    );
}

export default ScrollableChat;



