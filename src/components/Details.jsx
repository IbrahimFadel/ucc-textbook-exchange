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
		// console.log(data);
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

		this.getSenders();

		this.getMessages();
		setInterval(() => {
			this.getMessages();
		}, 1);
	}

	getMessages = () => {
		let messages = [];
		firebase
			.database()
			.ref("/messages/" + data.listingKey)
			.once("value")
			.then(snapshot => {
				snapshot.forEach(childsnapshot => {
					const messageData = childsnapshot.val();
					const message = {
						message: messageData.message,
						sent: messageData.from === this.state.uid ? true : false,
						to: messageData.to,
						from: messageData.from,
						otherUid:
							messageData.from === this.state.uid
								? messageData.to
								: messageData.from
					};
					messages.push(message);
				});
			})
			.then(() => {
				this.setState({
					messages: messages
				});
			});
	};

	getSenders = () => {
		let uids = [];
		firebase
			.database()
			.ref("/messages/" + data.listingKey)
			.once("value")
			.then(snapshot => {
				snapshot.forEach(childsnapshot => {
					const message = childsnapshot.val();
					if (
						message.from != this.state.uid &&
						uids.includes(message.from) === false
					) {
						uids.push(message.from);
					}
				});
			})
			.then(() => {
				this.convertUidsToUsernames(uids);
			});
	};

	convertUidsToUsernames = uids => {
		let senders = [];
		let amntUsers = 0;
		let count = 0;
		firebase
			.database()
			.ref("/users/")
			.once("value")
			.then(snapshot => {
				amntUsers = snapshot.numChildren();
				snapshot.forEach(childsnapshot => {
					const user = childsnapshot.val();
					if (uids.includes(user.uid)) {
						senders.push({ name: user.name, uid: user.uid });
					}
					count++;
				});
			})
			.then(() => {
				if (count === amntUsers) {
					this.setState({
						currentConvo: senders.length > 0 ? senders[0].uid : null,
						response: true,
						senders: senders
					});
				}
			});
	};

	conversationChanged = () => {
		this.setState({
			currentConvo: document.getElementById("conversation-select").value
		});
	};

	render() {
		if (this.state.response) {
			return (
				<div>
					<Navbar />
					<div id="details-container">
						<h1>{data.title}</h1>
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
									// Seller
									<div>
										{this.state.senders.length > 0 ? (
											<div>
												<h3 style={{ marginTop: "5vh" }}>Conversations</h3>
												<select
													id="conversation-select"
													onChange={this.conversationChanged}
												>
													{this.state.senders.map((sender, i) => {
														return (
															<option key={i} value={sender.uid}>
																{sender.name}
															</option>
														);
													})}
												</select>

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
											<div>No Messages!</div>
										)}
									</div>
								) : (
									// Buyer
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
												<MessageInput
													sellerUid={data.sellerUid}
													listing={data.listingKey}
													seller={false}
												/>
											</div>
										) : (
											<h5 id="emptyText">
												Wow! Much Empty. Start the Conversation?
											</h5>
										)}
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
