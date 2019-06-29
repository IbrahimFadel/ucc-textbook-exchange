import React, { Component } from "react";
import firebase from "./firebase/firebase";

import Navbar from "./Navbar";
import Card from "./Card";

import "../css/Listings.css";

var data = undefined;
var numChildren = undefined;
var count = 0;
var listings = [];

export default class Listings extends Component {
  constructor() {
    super();

    this.state = {
      response: false
    };
  }

  getListings = grade => {
    const path =
      grade !== "diplomaprogram" ? "grade" + grade : "diplomaprogram";
    firebase
      .database()
      .ref("/listings/" + path)
      .once("value")
      .then((snapshot, i) => {
        numChildren = snapshot.numChildren();
        if (numChildren === 0) {
          this.setState({
            response: true
          });
        }
        snapshot.forEach(childsnapshot => {
          const title = childsnapshot.val().title;
          const grade = childsnapshot.val().grade;
          const desc = childsnapshot.val().description;
          const email = childsnapshot.val().email;
          const uid = childsnapshot.val().uid;
          const listingKey = Object.keys(snapshot.val())[count];

          const listing = [title, grade, desc, email, uid, listingKey];
          listings.push(listing);
          count++;
          if (count === numChildren) {
            this.setState({
              response: true
            });
          }
        });
      });
  };

  componentDidMount() {
    data = this.props.location.state;
    this.getListings(data.grade);
  }

  render() {
    if (this.state.response) {
      return (
        <div>
          {listings.length > 0 ? (
            <div>
              {data.grade === "Diploma Program" ? (
                <div>
                  <h1>Diploma Program Listings</h1>
                </div>
              ) : (
                <div>
                  <h1 id="listingsTitle">Grade {data.grade} Listings</h1>

                  <div id="listingCardContainer">
                    {listings.map((data, i) => {
                      return (
                        <Card
                          key={i}
                          title={data[0]}
                          grade={data[1]}
                          description={data[2]}
                          uid={data[4]}
                          listingKey={data[5]}
                          className="card"
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Navbar />

              {data.grade !== "diplomaprogram" ? (
                <div>
                  <h1 style={{ textAlign: "center" }}>
                    No Listings for grade {data.grade}
                  </h1>
                </div>
              ) : (
                <div>
                  <h1 style={{ textAlign: "center" }}>
                    No Listings for the Diploma Program
                  </h1>
                </div>
              )}
            </div>
          )}
        </div>
      );
    } else {
      return <h1>Loading...</h1>;
    }
  }
}
