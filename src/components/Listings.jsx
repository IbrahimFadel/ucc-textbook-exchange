import React, { Component } from "react";
import firebase from "./firebase/firebase";

import Navbar from "./Navbar";
import Card from "./Card";
import SearchBar from "./SearchBar";

import "../css/Listings.css";

var data = undefined;
var numChildren = undefined;
var count = 0;
var listings = [];

export default class Listings extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      searchBarValue: ""
    };
  }

  componentDidMount() {
    data = this.props.location.state;
    this.getListings(data.grade);
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
          const imageName = childsnapshot.val().imageName;
          const sold = childsnapshot.val().sold;

          const listing = {
            title: title,
            grade: grade,
            desc: desc,
            email: email,
            uid: uid,
            listingKey: listingKey,
            imageName: imageName,
            sold: sold
          };
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

  onSearchBarChange = e => {
    const value = document.getElementById("searchbar-input").value;
    this.setState({
      searchBarValue: value
    });
  };

  render() {
    if (this.state.response) {
      return (
        <div>
          <Navbar />

          {listings.length > 0 ? (
            <div>
              {data.grade === "diplomaprogram" ? (
                <div>
                  <h1 style={{ textAlign: "center" }}>
                    Diploma Program Listings
                  </h1>

                  <SearchBar onChange={this.onSearchBarChange} />

                  <div id="listingCardContainer">
                    {listings.map((data, i) => {
                      if (this.state.searchBarValue != "") {
                        if (data.title.includes(this.state.searchBarValue)) {
                          if (!data.sold) {
                            return (
                              <Card
                                key={i}
                                title={data.title}
                                grade={data.grade}
                                description={data.desc}
                                uid={data.uid}
                                listingKey={data.listingKey}
                                imageName={data.imageName}
                                className="card"
                              />
                            );
                          }
                        }
                      } else {
                        if (!data.sold) {
                          return (
                            <Card
                              key={i}
                              title={data.title}
                              grade={data.grade}
                              description={data.desc}
                              uid={data.uid}
                              listingKey={data.listingKey}
                              imageName={data.imageName}
                              className="card"
                            />
                          );
                        }
                      }
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <h1 id="listingsTitle">Grade {data.grade} Listings</h1>

                  <SearchBar onChange={this.onSearchBarChange} />

                  <div id="listingCardContainer">
                    {listings.map((data, i) => {
                      if (this.state.searchBarValue != "") {
                        if (data.title.includes(this.state.searchBarValue)) {
                          return (
                            <Card
                              key={i}
                              title={data.title}
                              grade={data.grade}
                              description={data.desc}
                              uid={data.uid}
                              listingKey={data.listingKey}
                              imageName={data.imageName}
                              className="card"
                            />
                          );
                        }
                      } else {
                        return (
                          <Card
                            key={i}
                            title={data.title}
                            grade={data.grade}
                            description={data.desc}
                            uid={data.uid}
                            listingKey={data.listingKey}
                            imageName={data.imageName}
                            className="card"
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
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
