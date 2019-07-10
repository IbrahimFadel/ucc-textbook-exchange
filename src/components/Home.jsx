import React, { Component } from "react";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";

import scrollDownImg from "../img/scrollDown.png";

import "../css/Home.css";
import "../css/qcss/buttons.css";

const dpPath = "/grade/dp";
const grade10Path = "/grade/10";
const grade9Path = "/grade/9";
const grade8Path = "/grade/8";

export default class Home extends Component {
	render() {
		return (
			<div>
				<Navbar />
				<h1 id="home-title">UCC Textbook Exchange</h1>

				{/* <p id="home-desc">
					UCC book exchange helps make the transition in and out of the school
					year easy! Sell your textbooks, or buy some for the next school year!
				</p> */}

				<h3 style={{ textAlign: "center", marginTop: "5vh" }}>
					Selling a book
				</h3>

				<p className="home-help">
					To get started, navigate to the sell page, and fill out the textbook's
					info. Optionally upload an image of the textbook. To see all the books
					you are selling or have already sold, go to your profile. From there
					you can see all of your past activity. If someone is interested in
					your textbook, they might message you. From your listing you can look
					at all your different conversations and talk to potential buyers. If
					they want to buy it they can place a bid. Once you've decided who you
					will sell your book to, click on the sell button in the listing and
					follow the instructions!
				</p>

				<h3 style={{ textAlign: "center", marginTop: "5vh" }}>Buying a book</h3>

				<p className="home-help">
					To buy a textbook, you can scroll down at the home page and select the
					grade you're looking for. Once you've selected a grade, you can look
					at all the listings or search for the title. If you've found one
					you're interested in, then click on details. If you are signed in, you
					can message them and place a bid, otherwise all you can see is the
					description, title, and image if the've included it. Once you've
					placed a bid, you can wait to find out if the seller is gonna sell to
					you, or someone else. To see your purchases, look at your profile.
				</p>

				<h1 id="home-findTextbooks">Find textbooks now!</h1>

				<Link to="#home-gradeButtons">
					<img src={scrollDownImg} alt="Scroll Down" id="home-scrollImage" />
				</Link>

				<div id="home-gradeButtons">
					<Link
						to={{
							pathname: dpPath,
							state: {
								grade: "diplomaprogram"
							}
						}}
					>
						<button className="button button-outline dark">
							Diploma Program
						</button>
					</Link>
					<Link
						to={{
							pathname: grade10Path,
							state: {
								grade: 10
							}
						}}
					>
						<button className="button button-outline dark">Grade 10</button>
					</Link>
					<Link
						to={{
							pathname: grade9Path,
							state: {
								grade: 9
							}
						}}
					>
						<button className="button button-outline dark">Grade 9</button>
					</Link>
					<Link
						to={{
							pathname: grade8Path,
							state: {
								grade: 8
							}
						}}
					>
						<button className="button button-outline dark">Grade 8</button>
					</Link>
				</div>
			</div>
		);
	}
}
