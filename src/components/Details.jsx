import React, { Component } from "react";
import firebase from "firebase";
import { auth } from "./firebase/firebase";

import Navbar from "./Navbar";
import MessageInput from "./MessageInput";

import "../css/Details.css";

var data;

export default class Details extends Component {
  constructor() {
    super();

    this.state = {
      currentItem: "",
      username: "",
      items: [],
      user: null,
      message: "",
      uid: null,
      response: false,
      messages: null,
      senders: null,
      currentConvo: null
    };
  }

  componentDidMount() {
    data = this.props.location.state;
    this.getSenders();
    // this.getCurrentConvo(true);

    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState(
          {
            user: user,
            uid: user.uid
          },
          () => {}
        );
      } else {
        this.setState({
          user: null,
          uid: null
        });
      }
    });

    this.getMessages();
    setInterval(() => {
      this.getMessages();
    }, 1);
  }

  getCurrentConvo = firstCall => {
    if (firstCall) {
      this.setState({
        currentConvo: this.state.senders[0]
      });
    } else {
      const select = document.getElementById("convoSelect");
      const currentConvo = select.options[select.selectedIndex].value;
      this.setState({
        currentConvo: currentConvo
      });
    }
  };

  getMessages = () => {
    let messages = [];
    firebase
      .database()
      .ref("/messages/" + data.listingKey)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childsnapshot => {
          let message = {};
          const messageData = childsnapshot.val();
          message.message = messageData.message;
          message.from = messageData.from;
          message.to = messageData.to;
          if (messageData.from === this.state.uid) {
            message.sent = true;
            message.otherUid = messageData.to;
          } else {
            message.sent = false;
            message.otherUid = messageData.from;
          }
          messages.push(message);
        });
      })
      .then(() => {
        this.setState({
          messages: messages,
          response: true
        });
      });
  };

  getSenders = () => {
    let senders = [];
    firebase
      .database()
      .ref("/messages/" + data.listingKey)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childsnapshot => {
          const message = childsnapshot.val();
          if (
            message.from != this.state.uid &&
            senders.includes(message.from) === false
          ) {
            senders.push(message.from);
          }
        });
      })
      .then(() => {
        this.setState(
          {
            senders: senders
          },
          () => {
            this.getCurrentConvo(true);
          }
        );
      });
  };

  convoChanged = () => {
    const newConvo = document.getElementById("convoSelect").value;
    this.setState({
      currentConvo: newConvo
    });
  };

  render() {
    if (this.state.response) {
      return (
        <div>
          <Navbar />
          <div id="details-container">
            <h1>{data.title}</h1>
            {/* <p>{data.grade}</p> */}
            <h5>{data.description}</h5>

            {data.imageUrl != undefined ? (
              <div>
                <img src={data.imageUrl} />
              </div>
            ) : (
              <div />
            )}

            {this.state.user ? (
              <div>
                {this.state.uid === data.sellerUid ? (
                  <div>
                    {this.state.senders != null ? (
                      <div>
                        <h3 style={{ marginTop: "5vh" }}>Conversations</h3>
                        <select id="convoSelect" onChange={this.convoChanged}>
                          {this.state.senders.map((sender, i) => {
                            return (
                              <option key={i} value={sender}>
                                {sender}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : (
                      <h1>No Messages!</h1>
                    )}

                    {this.state.messages.length ? (
                      <div>
                        <div id="messages">
                          {this.state.messages.map((message, i) => {
                            if (message.otherUid === this.state.currentConvo) {
                              return (
                                <div>
                                  <div
                                    key={i}
                                    className={message.sent.toString()}
                                  >
                                    {message.message}
                                  </div>
                                  <br />
                                  <br />
                                </div>
                              );
                            }
                          })}
                        </div>
                        <MessageInput
                          sellerUid={data.sellerUid}
                          listing={data.listingKey}
                          seller={true}
                          receiverUid={this.state.currentConvo}
                        />
                      </div>
                    ) : (
                      <div>No messages!</div>
                    )}
                  </div>
                ) : (
                  <div>
                    {this.state.messages.length > 0 ? (
                      <div>
                        <div id="messages">
                          {this.state.messages.map((message, i) => {
                            if (
                              (message.otherUid === data.sellerUid &&
                                message.to === this.state.uid) ||
                              message.from === this.state.uid
                            ) {
                              return (
                                <div>
                                  <div
                                    key={i}
                                    className={message.sent.toString()}
                                  >
                                    {message.message}
                                  </div>
                                  <br />
                                  <br />
                                </div>
                              );
                            }
                          })}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h5 id="emptyText">
                          Wow! Much Empty. Start the Conversation?
                        </h5>
                      </div>
                    )}

                    <MessageInput
                      sellerUid={data.sellerUid}
                      listing={data.listingKey}
                      seller={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>You must be signed in to send or see messages</div>
            )}
          </div>
        </div>
      );
    } else {
      return <h1>Loading...</h1>;
    }
  }
}
