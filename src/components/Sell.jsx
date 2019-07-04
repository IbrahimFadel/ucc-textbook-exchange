import React, { Component } from "react";
import firebase, { auth } from "./firebase/firebase";

import Navbar from "./Navbar";

import "../css/Sell.css";
import "../css/qcss/buttons.css";

var imageFile = undefined;
var imageName = undefined;

export default class Sell extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: "",
      username: "",
      items: [],
      user: null,
      uid: null
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user: user,
          uid: user.uid
        });
        document.getElementById("signInToView").style.display = "none";
        document.getElementById("sell-form").style.display = "block";
      } else {
        document.getElementById("sell-form").style.display = "none";
        document.getElementById("signInToView").style.display = "block";
      }
    });
  }

  sell = () => {
    const title = document.getElementById("sell-textbookName").value;
    const grade = document.getElementById("sell-grade").value;
    const description = document.getElementById("sell-description").value;
    const user = firebase.auth().currentUser;
    const email = user.email;
    const uid = this.state.uid;

    if (title == "" || description == "") {
      alert("You have to write the title, grade, and description!");
      return;
    }

    let listing = {};

    listing.title = title;
    listing.grade = grade;
    listing.description = description;
    listing.email = email;
    listing.uid = uid;
    listing.sold = false;

    if (imageFile != undefined || imageName != undefined) {
      listing.imageName = imageName;

      var imageRef = firebase
        .storage()
        .ref("/images/" + grade + "/" + imageName);
      var uploadTask = imageRef.put(imageFile);

      uploadTask.on(
        "state_changed",
        snapshot => {},
        error => {
          alert(error.code, error.message);
        },
        () => {}
      );
    }

    firebase
      .database()
      .ref("/listings/" + grade.replace(/\s/g, "").toLowerCase())
      .push(listing);

    document.getElementById("sell-textbookName").value = "";
    document.getElementById("sell-grade").value = "";
    document.getElementById("sell-description").value = "";
  };

  onImageChanged = e => {
    imageFile = e.target.files[0];
    imageName = imageFile.name;
  };

  render() {
    return (
      <div>
        <Navbar />

        <h1 id="sell-title">Sell</h1>

        <form id="sell-form">
          <label className="sell-label">Textbook name:</label>
          <br />
          <input type="text" id="sell-textbookName" />
          <br />
          <label className="sell-label">Grade:</label>
          <br />
          <select id="sell-grade">
            <option value="Diploma Program">Diploma Program</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 8">Grade 8</option>
          </select>
          <br />
          <label className="sell-label">Description:</label>
          <br />
          <textarea id="sell-description" />
          <br />

          <label className="sell-label">Image</label>

          <input
            type="file"
            accept="image/x-png,image/gif,image/jpeg"
            id="image-input"
            onChange={this.onImageChanged}
          />

          <br />
          <button
            type="button"
            className="button dark"
            id="sell-button"
            onClick={this.sell}
          >
            Sell
          </button>
        </form>

        <div id="signInToView">
          <h1 id="signInToView-h1">You must be signed in to sell a textbook</h1>
        </div>
      </div>
    );
  }
}
