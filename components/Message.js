import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import moment from "moment";

const Message = ({ user, message }) => {

    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <TimeStamp>
                    {
                        message.timestamp ? moment(message.timestamp).format('LT') : "..."
                    }
                </TimeStamp>
            </TypeOfMessage>
        </Container>
    )
}

export default Message


const Container = styled.div`

`;

const MessageElement = styled.p`
    width: fit-content;
    padding: 10px 10px 30px 10px;
    border-radius: 8px;
    min-width: 65px;
    position: relative;
    text-align: right;
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
    text-align: left;
    background-color: white;
`;

const TimeStamp = styled.div`
    color: rgba(0,0,0, 0.45);
    padding: 8px 10px;
    font-size: 12px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0
`;