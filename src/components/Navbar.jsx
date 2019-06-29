import React, { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import "../css/Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";

const linkStyling = {
    color: "white",
    textDecoration: "none",
    letterSpacing: "3px"
};

export default class Home extends Component {
    navSlide = () => {
        // var burger = document.getElementById("burger");
        // var nav = document.querySelector(".nav-links");
        // burger.addEventListener("click", () => {
        //     console.log("hi");
        //     nav.classList.toggle("nav-active");
        //     console.log(nav);
        // });
    };

    componentDidMount() {
        this.navSlide();
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand" to="/">
                        Personal Project
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">
                                    Home{" "}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Buy
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/sell">
                                    Sell
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Login/Signup
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                {/* <nav>
                    <Link to="/">
                        <div className="logo">
                            <h4>Personal Project</h4>
                        </div>
                    </Link>
                    <ul className="nav-links">
                        <li className="li-nav">
                            <Link
                                to="/#gradesButtonContainer"
                                style={linkStyling}
                            >
                                Buy
                            </Link>
                        </li>
                        <li className="li-nav">
                            <Link to="/sell" style={linkStyling}>
                                Sell
                            </Link>
                        </li>
                        <li className="li-nav">
                            <Link to="/login" style={linkStyling}>
                                Login/Signup
                            </Link>
                        </li>
                        <li className="li-nav">
                            <Link to="/" style={linkStyling}>
                                About
                            </Link>
                        </li>
                    </ul>
                    <div className="burger" id="burger">
                        <div className="line1" />
                        <div className="line2" />
                        <div className="line3" />
                    </div>
                </nav> */}
            </div>
        );
    }
}
