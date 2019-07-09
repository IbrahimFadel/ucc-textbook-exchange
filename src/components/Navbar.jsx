import React, { Component } from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Navbar.css";

export default class Navbar extends Component {
	burgerClicked() {
		var links = document.querySelector(".nav-links");
		console.log(links);
		links.classList.toggle("links-active");
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
							<Link to="/articles">Articles</Link>
						</li>
						<li>
							<Link to="/contact">Contact</Link>
						</li>
						<li>
							<Link to="/login">Login/Signup</Link>
						</li>
					</ul>
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
