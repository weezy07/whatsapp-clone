import Head from "next/head";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

const UserChat = ({ messages, chat }) => {

    const [user] = useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>

            <Sidebar />

            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default UserChat

export async function getServerSideProps(context) {
    const ref = db.collection('chats').doc(context.query.id)

    // prepare the messages on the server
    const messagesResponse = await ref.collection('messages').orderBy('timestamp', 'asc').get()

    const messages = messagesResponse.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    // prepare the chats
    const chatResponse = await ref.get();
    const chat = {
        id: chatResponse.id,
        ...chatResponse.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none
    }
    --ms-overflow-style: none;
    scrollbar-width: none
`;
