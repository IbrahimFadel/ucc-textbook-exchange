import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "./firebase/firebase";

import "../css/Card.css";
import "bootstrap/dist/css/bootstrap.css";

const buttonStyle = {
	width: "30%",
	marginLeft: "0%"
};

var imageUrl = undefined;

export default class Card extends Component {
	constructor() {
		super();
		this.state = {
			response: false
		};
	}

	componentDidMount() {
		if (this.props.imageName !== undefined) this.getImageUrl();
		else this.setState({ response: true });
	}

	getImageUrl = () => {
		const storageRef = firebase.storage().ref("/");
		const imagePath =
			"/images/" + this.props.grade + "/" + this.props.imageName;
		storageRef
			.child(imagePath)
			.getDownloadURL()
			.then(downloadURL => {
				imageUrl = downloadURL;
				this.setState({
					response: true
				});
			})
			.catch(err => {
				this.setState({
					response: true
				});
				return;
			});
	};

	render() {
		if (this.state.response) {
			return (
				<div>
					<div className="card listingCard">
						<div className="card-body">
							<h5 className="card-title">{this.props.title}</h5>
							<p className="card-text">{this.props.description}</p>
							<hr />
							{this.props.imageName != undefined ? (
								<div>
									<img src={imageUrl} className="card-img" />
								</div>
							) : (
								<div />
							)}
							<Link
								to={{
									pathname: "/details/" + this.props.listingKey,
									state: {
										title: this.props.title,
										grade: this.props.grade,
										description: this.props.description,
										sellerUid: this.props.uid,
										listingKey: this.props.listingKey,
										imageUrl: imageUrl,
										sold: this.props.sold
									}
								}}
							>
								<button
									className="button dark detailsButton"
									style={buttonStyle}
								>
									Details
								</button>
							</Link>
						</div>
					</div>
				</div>
			);
		} else {
			return <h1>Loading...</h1>;
		}
	}
}
