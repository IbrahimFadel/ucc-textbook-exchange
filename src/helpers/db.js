import firebase from "firebase";

export function postMessage(message, to, from, listing) {
  const messageObject = { message: message, to: to, from: from };

  firebase
    .database()
    .ref("/messages/" + listing)
    .push(messageObject);
}
