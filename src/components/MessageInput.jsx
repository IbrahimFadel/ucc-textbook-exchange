import React, { Component } from "react";
import { auth } from "./firebase/firebase.js";
import $ from "jquery";
import Swal from "sweetalert2";

import { postMessage } from "../helpers/db.js";

import "../css/MessageInput.css";
import "../css/qcss/buttons.css";

export default class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: "",
      username: "",
      items: [],
      user: null,
      message: "",
      uid: null
    };
  }

  componentDidMount() {
    $("#messageInputForm").submit(function(e) {
      e.preventDefault();
    });
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user: user,
          uid: user.uid
        });
      } else {
        console.log("OH NO! NOT SIGNED IN lol");
      }
    });
  }

  _onChange = e => {
    this.setState({
      message: e.target.value
    });
  };

  _handleMessageSend = e => {
    if (e.key === "Enter") {
      document.getElementById("messageInput").value = "";
      const message = this.state.message;
      const from = this.state.uid;
      let to = undefined;
      if (this.props.seller) {
        to = this.props.receiverUid;
      } else {
        to = this.props.sellerUid;
      }
      const listing = this.props.listing;
      if (from === to) {
        alert("You can't send a message to yourself!");
        return;
      }
      postMessage(message, to, from, listing);
    }
  };

  render() {
    return (
      <div>
        <form id="messageInputForm">
          <input
            id="messageInput"
            type="text"
            onChange={this._onChange}
            onKeyDown={this._handleMessageSend}
          />
          <button
            type="button"
            id="messageInputButton"
            className="button primary"
            onClick={this._handleMessageSend}
          >
            Send
          </button>
        </form>
      </div>
    );
  }
}
