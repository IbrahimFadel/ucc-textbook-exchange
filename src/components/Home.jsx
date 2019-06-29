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

        <p id="home-desc">
          [Personal Project] makes your life easier! Sell used textbooks, or buy
          some for the next school year!
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
