import React, { Component } from "react";
import firebase from "firebase";
import { auth } from "./firebase/firebase";
import Swal from "sweetalert2";
import { Link, Redirect } from "react-router-dom";

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

		if (data.sold === true) data.sold = "Yes";
		else if (data.sold === false) data.sold = "No";

		auth.onAuthStateChanged(user => {
			if (user) {
				this.setState({
					user: user,
					uid: user.uid
				});
			} else {
				this.setState({
					user: null,
					uid: null
				});
			}
		});

		if (data.sold === "Yes") {
			Swal.fire(
				"This post is archived",
				"This post has been sold. You can only access it from your profile. You can no longer send or recieve messages, or edit this listing",
				"info"
			);
		}

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
						senders.push({
							name: user.name,
							uid: user.uid
						});
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

	delete = () => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!"
		}).then(result => {
			if (result.value) {
				const gradeName =
					data.grade === "Diploma Program" ? "diplomaprogram" : data.grade;
				const path = `/listings/${gradeName}/${data.listingKey}/`;
				firebase
					.database()
					.ref(path)
					.remove()
					.catch(err => {
						alert(err.code, err.message);
					})
					.then(() => {
						Swal.fire(
							"Deleted!",
							"Your listing has been deleted.",
							"success"
						).then(() => {
							this.props.history.push(`/`);
						});
					});
			}
		});
	};

	render() {
		if (this.state.response) {
			return (
				<div>
					<Navbar />
					<div id="details-container">
						<h1>{data.title}</h1>

						{this.state.uid === data.sellerUid && data.sold === "No" ? (
							<div>
								<div id="options">
									<Link
										to={{
											pathname: "/edit",
											state: {
												title: data.title,
												description: data.description,
												grade: data.grade,
												listingKey: data.listingKey,
												email: data.email,
												imageName: data.imageName,
												sold: data.sold,
												uid: data.sellerUid,
												email: data.email
											}
										}}
										className="option-link"
									>
										Edit
									</Link>
									<a onClick={this.delete} className="option-link">
										Delete
									</a>
								</div>
								{data.sold === "No" ? (
									<div>
										<div id="option-links-left">
											<Link
												to={{
													pathname: "/bids",
													state: {
														listingKey: data.listingKey,
														sellerUid: data.sellerUid,
														grade: data.grade
													}
												}}
												className="option-link"
											>
												View Bids
											</Link>
										</div>
									</div>
								) : (
									<div />
								)}
							</div>
						) : (
							<div id="options">
								{this.state.uid !== data.sellerUid || data.sold === "No" ? (
									<div>
										<Link
											to={{
												pathname: "/bid",
												state: {
													listingKey: data.listingKey,
													sellerUid: data.sellerUid,
													title: data.title,
													description: data.description,
													imageUrl: data.imageUrl,
													grade: data.grade
												}
											}}
											className="option-link"
										>
											Place Bid
										</Link>
									</div>
								) : (
									<div />
								)}
							</div>
						)}

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
												<h3
													style={{
														marginTop: "5vh"
													}}
												>
													Conversations
												</h3>
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
											<div>
												<h5 id="emptyText">
													Wow! Much Empty. Start the Conversation?
												</h5>
												<MessageInput
													sellerUid={data.sellerUid}
													listing={data.listingKey}
													seller={false}
												/>
											</div>
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
