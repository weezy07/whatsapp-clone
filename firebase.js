import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCIRxOxxSjvVldGLJHWeWrV1WdkTNNLdJo",
    authDomain: "whatsapp-clone-a2e22.firebaseapp.com",
    projectId: "whatsapp-clone-a2e22",
    storageBucket: "whatsapp-clone-a2e22.appspot.com",
    messagingSenderId: "966163254394",
    appId: "1:966163254394:web:027203c2c1dec3c9f1ffc3"
};

//   re-initialize the app if anything changes
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };