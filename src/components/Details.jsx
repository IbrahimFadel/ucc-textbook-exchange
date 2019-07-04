import React, { Component } from "react";
import firebase from "firebase";
import { auth } from "./firebase/firebase";
import Swal from "sweetalert2";

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
      currentConvo: null,
      sellForm: false
    };
  }

  componentDidMount() {
    data = this.props.location.state;
    this.getSenders();

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

  sellPrompt = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once you sell, this listing will be removed from the website!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sell it!"
    }).then(result => {
      if (result.value) {
        this.sell();
        Swal.fire("Sold!", "Your book has been successfully sold!", "success");
      }
    });
  };

  sell = () => {
    let count = 0;
    const path = "/listings/" + data.grade.replace(" ", "").toLowerCase();
    console.log(path);
    firebase
      .database()
      .ref(path)
      .once("value")
      .then(snapshot => {
        snapshot.forEach((childsnapshot, i) => {
          if (
            childsnapshot.val().uid === this.state.uid &&
            childsnapshot.val().title === data.title &&
            childsnapshot.val().description === data.description
          ) {
            const listingKey = Object.keys(snapshot.val())[count];
            firebase
              .database()
              .ref(path + "/" + listingKey)
              .set({
                sold: true,
                title: childsnapshot.val().title,
                description: childsnapshot.val().description,
                email: childsnapshot.val().email,
                grade: childsnapshot.val().grade,
                uid: childsnapshot.val().uid,
                imageName: data.imageUrl
              });
          }
          count++;
        });
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
                                  <p
                                    key={i}
                                    className={message.sent.toString()}
                                  >
                                    {message.message}
                                  </p>
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

                    <button
                      className="button button-outline dark"
                      style={{ margin: "auto", marginTop: "5vh" }}
                      onClick={() =>
                        this.setState({ sellForm: !this.state.sellForm })
                      }
                    >
                      Sell Textbook
                    </button>

                    {this.state.sellForm ? (
                      <div>
                        <form id="sellForm">
                          <label>Who do you want to sell to?</label>
                          <br />
                          <select>
                            {this.state.senders.map((sender, i) => {
                              return (
                                <option key={i} value={sender}>
                                  {sender}
                                </option>
                              );
                            })}
                          </select>
                          <br />
                          <button
                            className="button light"
                            style={{ margin: "auto", marginTop: "3vh" }}
                            onClick={this.sellPrompt}
                            type="button"
                          >
                            Sell
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div />
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
                                  <p
                                    key={i}
                                    className={message.sent.toString()}
                                  >
                                    {message.message}
                                  </p>
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
