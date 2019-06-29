import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../css/Card.css";
import "bootstrap/dist/css/bootstrap.css";

const buttonStyle = {
  width: "30%",
  marginLeft: "0%"
};

export default class Card extends Component {
  render() {
    return (
      <div>
        <div className="card listingCard">
          <div className="card-body">
            <h5 className="card-title">{this.props.title}</h5>
            <p className="card-text">{this.props.description}</p>
            <hr />
            <Link
              to={{
                pathname: "/details/" + this.props.listingKey,
                state: {
                  title: this.props.title,
                  grade: this.props.grade,
                  description: this.props.description,
                  sellerUid: this.props.uid,
                  listingKey: this.props.listingKey
                }
              }}
            >
              <button className="button dark detailsButton" style={buttonStyle}>
                Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
