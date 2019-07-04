import firebase from "../components/firebase/firebase";
import Swal from "sweetalert2";

export function createUser(email, password, name) {
  if (!email.includes("@ucc.on.ca")) {
    Swal.fire("Oops...", "You must have a ucc email to signup!", "error");
    return;
  }
  let newUser = undefined;
  let ableToCreateUser = true;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(err => {
      Swal.fire("Oops...", err.message, "error");
      ableToCreateUser = false;
    })
    .then(user => {
      if (ableToCreateUser) {
        newUser = {
          email: email,
          uid: user.user.uid,
          name: name
        };
      }
    })
    .then(() => {
      if (ableToCreateUser) {
        pushNewUserToDB(newUser);
      }
    });
}

function pushNewUserToDB(user) {
  firebase
    .database()
    .ref("/users/")
    .push(user)
    .then(() => {
      Swal.fire("Success! Your account has been created!");
    });
}
