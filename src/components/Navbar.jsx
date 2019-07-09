import React, { Component } from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebase/firebase";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Navbar.css";

const PICTURE_SIZE = 50;

export default class Navbar extends Component {
	constructor() {
		super();

		this.state = {
			user: null,
			uid: null
		};
	}

	componentDidMount() {
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
	}

	burgerClicked() {
		var links = document.querySelector(".nav-links");
		console.log(links);
		links.classList.toggle("links-active");
	}

	profileClicked = () => {
		document
			.getElementById("profile-dropdown")
			.classList.toggle("dropdown-toggled");
	};

	render() {
		return (
			<div id="nav-container">
				<nav className="nav">
					<Link to="/">
						<h3 className="logo">UCC Book Exchange</h3>
					</Link>
					<ul className="nav-links">
						<li>
							<Link to="/" className="active">
								Home
							</Link>
						</li>
						<li>
							<Link to="/articles">Articles</Link>
						</li>
						<li>
							<Link to="/contact">Contact</Link>
						</li>
						<li>
							<Link to="/login">Login/Signup</Link>
						</li>
					</ul>
					{this.state.user ? (
						<div id="profile-picture">
							<div class="dropdown">
								<img
									src={
										"https://api.adorable.io/avatars/" +
										PICTURE_SIZE +
										"/" +
										this.state.uid
									}
									className="dropbtn"
									onClick={this.profileClicked}
								/>
								<div class="dropdown-content">
									<Link to="/profile">Profile</Link>
								</div>
							</div>
						</div>
					) : (
						<div />
					)}
					<div className="burger" onClick={this.burgerClicked}>
						<div className="line1" />
						<div className="line2" />
						<div className="line3" />
					</div>
				</nav>
			</div>
		);
	}
}
