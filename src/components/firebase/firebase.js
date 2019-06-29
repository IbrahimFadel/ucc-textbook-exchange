import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyAQOz7J0HmBuT_UeP1sh2XPbZhk3yvHsYo",
    authDomain: "personal-project-a8dc8.firebaseapp.com",
    databaseURL: "https://personal-project-a8dc8.firebaseio.com",
    projectId: "personal-project-a8dc8",
    storageBucket: "personal-project-a8dc8.appspot.com",
    messagingSenderId: "11254786641"
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
