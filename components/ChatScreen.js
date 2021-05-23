import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useRef } from "react";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Message from "./Message";
import { InsertEmoticon } from "@material-ui/icons";
import MicIcon from "@material-ui/icons/Mic";
import SearchIcon from '@material-ui/icons/Search';
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

const ChatScreen = ({ chat, messages }) => {

    const endOfMessageRef = useRef(null);
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const router = useRouter();
    // to get the message present in respective user chat
    const [messagesSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'))

    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(chat.users, user)))

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message key={message.id} user={message.data().user} message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime()
                }} />
            ))
        }
        else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    }

    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }

    const sendMessage = (e) => {
        e.preventDefault();

        // updates the last seen of the recipient user
        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        })

        setInput("");
        scrollToBottom();
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                {
                    recipient ? (
                        <Avatar src={recipient?.photoURL} />
                    ) : (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )
                }

                <HeaderInformation>
                    <h4>{recipientEmail}</h4>
                    {
                        recipientSnapshot ? (
                            <p>Last active: {''}
                                {recipient?.lastSeen?.toDate() ? (
                                    <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                                ) : "Unavailable"}
                            </p>
                        )
                            : (
                                <p>Loading...</p>
                            )
                    }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {/* show messages */}
                {showMessages()}
                <EndOfMessage ref={endOfMessageRef} />
            </MessageContainer>

            <InputContainer>
                <IconButton>
                    <InsertEmoticon />
                </IconButton>
                <IconButton>
                    <AttachFileIcon />
                </IconButton>

                <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send</button>

                <IconButton>
                    <MicIcon />
                </IconButton>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div`
    height: 100vh
`;

const Header = styled.div`
    position: sticky;
    background-color: #ededed;
    z-index: 1000;
    top: 0;
    display: flex;
    padding: 10px 20px;
    align-items: center;
    height: 60px;
    border-left: 1px solid rgba(0,0,0,0.08);
    border-bottom: 1px solid rgba(0,0,0,0.08);
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h4 {
        margin-bottom: 3px
    }

    > p {
        margin: 3px 0 22px 0;
        color: grey;
        font-size: 14px
    }
`;

const HeaderIcons = styled.div`

`;

const MessageContainer = styled.div`
    padding: 30px;
    background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
    min-height: 81.5vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 60px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
    border-left: 1px solid rgba(0,0,0,0.08);
    background: #f0f0f0
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    align-items: center;
    padding: 15px 17px;
    position: sticky;
    bottom: 0;
    background-color: white;
    border-radius: 25px;
    margin: 0 15px
`;