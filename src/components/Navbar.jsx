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
			uid: null,
			width: null,
			pictureIncluded: false
		};
	}

	componentDidMount() {
		window.addEventListener("resize", this.resized);

		if (window.innerWidth <= 1000) {
			this.setState({
				pictureIncluded: false
			});
		} else {
			this.setState({
				pictureIncluded: true
			});
		}

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

	resized = () => {
		this.setState(
			{
				width: window.innerWidth
			},
			() => {
				if (this.state.width <= 1000) {
					this.setState({
						pictureIncluded: false
					});
				} else {
					this.setState({
						pictureIncluded: true
					});
				}
			}
		);
	};

	burgerClicked() {
		const links = document.querySelector(".nav-links");
		links.classList.toggle("links-active");

		document.querySelector("html").classList.toggle("noScrolling");
	}

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
							<Link to="/sell">Sell</Link>
						</li>
						<li>
							<Link to="/">Buy</Link>
						</li>
						<li>
							<Link to="/login">Login/Signup</Link>
						</li>
						{this.state.user && !this.state.pictureIncluded ? (
							<div>
								<li>
									<Link to="/profile">Profile</Link>
								</li>
							</div>
						) : (
							<div />
						)}
					</ul>
					{this.state.user && this.state.pictureIncluded ? (
						<div id="profile-picture">
							<div className="dropdown">
								<img
									src={
										"https://api.adorable.io/avatars/" +
										PICTURE_SIZE +
										"/" +
										this.state.uid
									}
									className="dropbtn"
								/>
								<div className="dropdown-content">
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
