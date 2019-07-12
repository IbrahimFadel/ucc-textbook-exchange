import React, { Component } from "react";

import Navbar from "./Navbar";

export default class NotFound extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Navbar />
				<h1 style={{ textAlign: "center", marginTop: "5vh" }}>
					Looks like you're lost
				</h1>
				<h3 style={{ textAlign: "center", marginTop: "5vh" }}>Error 404</h3>
				<h5 style={{ textAlign: "center", marginTop: "5vh" }}>
					The page you're looking for does not exist or no longer exists
				</h5>
			</div>
		);
	}
}
