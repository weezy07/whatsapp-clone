import styled from "styled-components";
import { Avatar, Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";

const Sidebar = () => {

    const [user] = useAuthState(auth);
    // queries the firestore database for the user who is logged in and gives all the chats with the signed-in user
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    // map the chats to realtime listener
    const [chatsSnapshot] = useCollection(userChatRef);

    // function to create a chat
    const createChat = () => {
        const input = prompt("Please enter an email for the user you wish to chat with");

        if (!input) return null;

        if (EmailValidator.validate(input) && !chatExists(input) && input !== user.email) {
            // push this chat to db if it exists and is valid
            db.collection("chats").add({
                // creating a chat between te user which is signed in and the user whose address we are entering in input alert.
                users: [user.email, input] // [arg 1, arg 2] = [signed in user, user you want to chat with]
            })
        }
    }

    const chatExists = (recipientEmail) => {
        // check if chat between existing user and new user email already exists in 'chats' collection of database
        // chaining(?.) done here to handle the crash of code if data is undefined or null
        let isChatExists = !!chatsSnapshot?.docs.find(
            (chat) => chat.data().users.find(user => user === recipientEmail)?.length > 0
        );

        return isChatExists
    }


    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>

            <SidebarUsers>
                <SearchWrapper>
                    <Search>
                        <SearchIcon style={{ color: "#919191" }} />
                        <SearchInput placeholder="Search in chats" />
                    </Search>
                </SearchWrapper>

                <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

                {/* List of Chats */}
                {
                    chatsSnapshot?.docs.map(chat => (
                        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                    ))
                }
            </SidebarUsers>

        </Container>
    );
};

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid rgba(0,0,0,0.02);
    height: 100vh;
    min-width: 350px;
    max-width: 380px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const SidebarUsers = styled.div`
    
`;

const SearchWrapper = styled.div`
    background-color: #f6f6f6;
    padding: 9px 20px;
`;

const Search = styled.div`
    display: flex;
    background-color: white;
    align-items: center;
    border-radius: 20px;
    padding: 5px 15px;
`;

const SearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
    color: #4a4a4a;
    height: 30px;
    padding: 0 30px
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: #ededed;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 60px;
    border-bottom: 1px solid rgba(0,0,0,0.08)
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.7;
    }
`;

const IconsContainer = styled.div`

`;