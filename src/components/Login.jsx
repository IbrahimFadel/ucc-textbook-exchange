import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase, { auth } from "./firebase/firebase.js";
import Swal from "sweetalert2";

import Navbar from "./Navbar";
// import { loginEmailPassword } from "../helpers/auth";

import "../css/Login.css";
import "../css/qcss/buttons.css";

export default class Login extends Component {
    constructor() {
        super();

        this.state = {
            currentItem: "",
            username: "",
            items: [],
            user: null
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ user });
                document.getElementById("login-form").style.display = "none";
                document.getElementById("logoutDiv").style.display = "block";
            } else {
                document.getElementById("login-form").style.display = "block";
                document.getElementById("logoutDiv").style.display = "none";
            }
        });
    }

    login = () => {
        let email = document.getElementById("login-email").value;
        let password = document.getElementById("login-password").value;

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user;
                this.setState({
                    user
                });
            })
            .catch(function(err) {
                Swal.fire("Oops...", err.message, "error");
            });
    };

    logout = () => {
        auth.signOut().then(() => {
            this.setState({
                user: null
            });
        });
    };

    render() {
        return (
            <div>
                <Navbar />

                <h1 id="login-title">Login</h1>

                <form id="login-form">
                    <p id="login-formSignupLink">
                        If you don't have an account, sign up
                        <Link to="/signup" id="login-signupHere">
                            {" "}
                            here!
                        </Link>
                    </p>
                    <br /> <br />
                    <label className="login-inputLabel">Email:</label>
                    <br />
                    <input
                        type="email"
                        className="login-input"
                        id="login-email"
                    />
                    <br /> <br />
                    <label className="login-inputLabel">Password:</label>
                    <br />
                    <input
                        type="password"
                        className="login-input"
                        id="login-password"
                    />
                    <br />
                    <button
                        type="button"
                        className="button dark"
                        id="login-button"
                        onClick={this.login}
                    >
                        Login
                    </button>
                </form>

                <div id="logoutDiv">
                    <h3>You are logged in</h3>
                    <button
                        type="button"
                        className="button dark"
                        onClick={this.logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }
}
