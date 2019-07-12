import React, { Component } from "react";
import firebase from "./firebase/firebase";

import Navbar from "./Navbar";

import "../css/Bids.css";
import Swal from "sweetalert2";

var data;
var bidderData = [];

export default class Bids extends Component {
	constructor() {
		super();
		this.state = {
			response: false,
			bidders: null
		};
	}

	componentDidMount() {
		data = this.props.location.state;

		this.getBids();
	}

	getBids = () => {
		const grade =
			data.grade === "Diploma Program" ? "diplomaprogram" : data.grade;
		const path = `/listings/${grade}/${data.listingKey}`;
		firebase
			.database()
			.ref(path)
			.once("value")
			.then(snapshot => {
				const listing = snapshot.val();
				if (listing.bidders === undefined)
					return this.setState({
						bidders: [],
						response: true
					});
				if (listing.bidders.length === 0)
					return this.setState({
						bidders: [],
						response: true
					});
				this.convertUidsToNames(listing.bidders);
				bidderData = listing.bidders;
			});
	};

	convertUidsToNames = bids => {
		let names = [];
		firebase
			.database()
			.ref("/users/")
			.once("value")
			.then(snapshot => {
				snapshot.forEach(childsnapshot => {
					const user = childsnapshot.val();
					for (let bid of bids) {
						if (bid.uid === user.uid) {
							names.push({ name: user.name, amount: bid.amount });
						}
					}
				});
			})
			.then(() => {
				this.setState({
					bidders: names,
					response: true
				});
			});
	};

	accepted = i => {
		Swal.fire({
			title: "Are you sure?",
			text: "Once you accept, you can't go back!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, sell it!"
		}).then(result => {
			if (result.value) {
				this.accept(bidderData[i], i);
			}
		});
	};

	accept = (bid, i) => {
		const grade =
			data.grade === "Diploma Program" ? "diplomaprogram" : data.grade;
		const path = `/listings/${grade}/${data.listingKey}/`;
		firebase
			.database()
			.ref(path)
			.child("winningBid")
			.set(bid)
			.then(() => {
				Swal.fire(
					"Success!",
					`You have sold your book to: ${this.state.bidders[i].name}!`,
					"success"
				);
				this.props.history.push(`/`);
			});
	};

	render() {
		if (this.state.response) {
			return (
				<div>
					<Navbar />
					<h1 id="bids-title">Your Bids</h1>

					{this.state.bidders.length === 0 ? (
						<h5 style={{ textAlign: "center", marginTop: "5vh" }}>No Bids</h5>
					) : (
						<div>
							<table border="1" id="bids-table">
								<thead id="bids-thead">
									<tr>
										<th>User</th>
										<th>Bid</th>
										<th id="filledIn-th" />
									</tr>
								</thead>

								{this.state.bidders.map((bid, i) => {
									return (
										<tbody key={i}>
											<tr>
												<td>{bid.name}</td>
												<td>${bid.amount}</td>
												<td>
													<button
														className="accept-button"
														onClick={() => this.accepted(i)}
													>
														Accept
													</button>
												</td>
											</tr>
										</tbody>
									);
								})}
							</table>
						</div>
					)}
				</div>
			);
		} else {
			return <h1>Loading...</h1>;
		}
	}
}
