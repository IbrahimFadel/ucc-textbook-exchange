import React, { Component } from "react";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";
// import { auth, provider } from "./firebase/firebase";
import { createUser } from "../helpers/auth";

import "../css/Signup.css";
import "../css/qcss/buttons.css";

export default class Signup extends Component {
    signup = () => {
        let email = document.getElementById("signup-emailInput").value;
        let password = document.getElementById("signup-passwordInput").value;

        createUser(email, password);

        // this.props.history.push("/");

        document.getElementById("signup-emailInput").value = "";
        document.getElementById("signup-passwordInput").value = "";
    };

    render() {
        return (
            <div>
                <Navbar />

                <h1 id="signup-title">Singup</h1>

                <form id="signup-form">
                    <p id="signup-formSignupLink">
                        If you already have an account, login
                        <Link to="/login" id="signup-signupHere">
                            {" "}
                            here!
                        </Link>
                    </p>
                    <br /> <br />
                    <label className="signup-inputLabel">Email:</label>
                    <br />
                    <input
                        type="email"
                        className="signup-input"
                        id="signup-emailInput"
                    />
                    <br /> <br />
                    <label className="signup-inputLabel">Password:</label>
                    <br />
                    <input
                        type="password"
                        className="signup-input"
                        id="signup-passwordInput"
                    />
                    <br />
                    <button
                        type="button"
                        className="button dark"
                        id="signup-button"
                        onClick={this.signup}
                    >
                        Signup
                    </button>
                </form>
            </div>
        );
    }
}
