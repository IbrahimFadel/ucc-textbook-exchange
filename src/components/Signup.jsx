import React, { Component } from "react";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";
// import { auth, provider } from "./firebase/firebase";
import { createUser } from "../helpers/auth";

import "../css/Signup.css";
import "../css/qcss/buttons.css";

export default class Signup extends Component {
  signup = () => {
    const email = document.getElementById("signup-emailInput").value;
    const password = document.getElementById("signup-passwordInput").value;
    const name = document.getElementById("signup-nameInput").value;

    createUser(email, password, name);

    // this.props.history.push("/");

    document.getElementById("signup-emailInput").value = "";
    document.getElementById("signup-passwordInput").value = "";
    document.getElementById("signup-nameInput").value = "";
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
          <br />
          <label className="signup-inputLabel">Email:</label>
          <input type="email" id="signup-emailInput" className="signup-input" />
          <br />
          <label className="signup-inputLabel">Name:</label>
          <input type="text" id="signup-nameInput" className="signup-input" />
          <br />
          <label className="signup-inputLabel">Password:</label>
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
