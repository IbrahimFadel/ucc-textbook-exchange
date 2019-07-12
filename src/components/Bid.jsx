import React, { Component } from "react";
import Swal from "sweetalert2";
// import firebase from "firebase";
import firebase, { auth } from "./firebase/firebase";

import Navbar from "./Navbar";

import "../css/qcss/buttons.css";
import "../css/Bid.css";

var data;

export default class Bid extends Component {
	constructor() {
		super();
		this.state = {
			response: false
		};
	}

	componentDidMount() {
		data = this.props.location.state;
		this.setState({
			response: true
		});

		auth.onAuthStateChanged(user => {
			if (user) {
				this.setState({
					user: user,
					uid: user.uid
				});
			}
		});
	}

	offerChanged = e => {
		this.setState({
			offer: document.getElementById("offer-input").value
		});
	};

	placeBid = () => {
		if (isNaN(this.state.offer))
			return Swal.fire(
				"Invalid bid",
				"Please put a number in the offer",
				"warning"
			);

		const grade =
			data.grade === "Diploma Program" ? "diplomaprogram" : data.grade;
		const path = `/listings/${grade}/${data.listingKey}/`;

		firebase
			.database()
			.ref(path)
			.once("value")
			.then(snapshot => {
				const listing = snapshot.val();
				if (listing.bidders === undefined) {
					this.createBiddersData();
				} else {
					this.addBidToBidders(listing.bidders);
				}
			});

		document.getElementById("offer-input").value = "";
	};

	addBidToBidders = bidders => {
		const grade =
			data.grade === "Diploma Program" ? "diplomaprogram" : data.grade;
		const path = `/listings/${grade}/${data.listingKey}/`;

		const bid = {
			uid: this.state.uid,
			amount: this.state.offer
		};

		bidders.push(bid);

		firebase
			.database()
			.ref(path)
			.child("bidders")
			.set(bidders)
			.then(() => {
				this.setState({
					offer: ""
				});
			});
	};

	createBiddersData = () => {
		const grade =
			data.grade === "Diploma Program" ? "diplomaprogram" : data.grade;
		const path = `/listings/${grade}/${data.listingKey}/`;

		const bid = {
			uid: this.state.uid,
			amount: this.state.offer
		};

		firebase
			.database()
			.ref(path)
			.child("bidders")
			.set([bid])
			.then(() => {
				this.setState({
					offer: ""
				});
			});
	};

	render() {
		if (this.state.response) {
			return (
				<div>
					<Navbar />

					<h1 style={{ textAlign: "center", marginTop: "5vh" }}>Bid</h1>

					<h3 style={{ textAlign: "center", marginTop: "3vh" }}>
						You want to buy:
					</h3>
					<br />
					<h4 style={{ textAlign: "center", marginTop: "3vh" }}>
						{data.title}
					</h4>
					<p style={{ textAlign: "center", marginTop: "3vh" }}>
						{data.description}
					</p>
					{!data.imageUrl !== undefined ? (
						<div id="imageContainer">
							<img src={data.imageUrl} id="bid-image" />
						</div>
					) : (
						<div />
					)}
					<br />
					<div id="form-container" style={{ textAlign: "center" }}>
						<h4 style={{ textAlign: "center", marginTop: "5vh" }}>
							How much are you offering?
						</h4>
						<br />
						<br />
						<input
							type="number"
							id="offer-input"
							min="0"
							max="100"
							onChange={this.offerChanged}
						/>
						<button
							id="placeBid-button"
							className="button primary"
							type="button"
							onClick={this.placeBid}
						>
							Place Bid
						</button>
					</div>
				</div>
			);
		} else {
			return <h1>Loading...</h1>;
		}
	}
}
