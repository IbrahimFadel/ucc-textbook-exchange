import firebase from "../components/firebase/firebase";
import Swal from "sweetalert2";

export function createUser(email, password, name) {
	let newUser = undefined;
	let ableToCreateUser = true;

	if (!email.includes("@ucc.on.ca")) {
		Swal.fire("Oops...", "You must have a ucc email to signup!", "error");
		return;
	}

	firebase
		.database()
		.ref("/users/")
		.once("value")
		.then(snapshot => {
			snapshot.forEach(childsnapshot => {
				const user = childsnapshot.val();
				if (user.name === name) {
					ableToCreateUser = false;
					Swal.fire("Oops...", "Another user is using that name!", "error");
					return;
				}
			});
		})
		.then(() => {
			if (ableToCreateUser) {
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
		});
}

function pushNewUserToDB(user) {
	firebase
		.database()
		.ref("/users/")
		.push(user)
		.then(() => {
			Swal.fire("Success!", "Your account has been created!", "success");
		});
}
