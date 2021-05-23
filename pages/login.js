import Head from "next/head";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase"

const Login = () => {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <Logo src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
                <Button onClick={signIn} variant="outlined">Sign in with Google</Button>
            </LoginContainer>
        </Container>
    );
};

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    padding: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 0px 9px 6px rgba(159,151,151,0.32);
    -webkit-box-shadow: 0px 0px 9px 6px rgba(159,151,151,0.32);

`;

const Logo = styled.img`
    width: 200px;
    height: 200px;
    margin-bottom: 60px
`;