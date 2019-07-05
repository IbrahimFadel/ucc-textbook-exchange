import React, { Component } from "react";
import firebase, { auth } from "./firebase/firebase";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";

import "../css/Profile.css";

var titles = [];
var descriptions = [];
var grades = [];
var sold = [];
var listingKeys = [];
var imageNames = [];

export default class Profile extends Component {
  constructor() {
    super();

    this.state = {
      currentItem: "",
      username: "",
      items: [],
      user: null,
      uid: null,
      email: null,
      name: null,
      response: false,
      currentTab: "General",
      sales: null
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState(
          {
            user: user,
            uid: user.uid,
            email: user.email
          },
          () => {
            this.findSales();
            this.getName();
          }
        );
      } else {
        this.setState({
          user: undefined,
          uid: undefined,
          email: undefined
        });
      }
    });
  }

  findSales = () => {
    let sales = [];
    firebase
      .database()
      .ref("/listings/")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childsnapshot => {
          const listings = Object.values(childsnapshot.val());
          for (let i = 0; i < listings.length; i++) {
            const listing = listings[i];
            if (listing.uid === this.state.uid) {
              const listingKey = Object.keys(childsnapshot.val())[i];
              listingKeys.push(listingKey);
              sales.push(listing);
            }
          }
        });
      })
      .then(() => {
        this.setState(
          {
            sales: sales
          },
          () => {
            this.populateSalesTableData();
          }
        );
      });
  };

  populateSalesTableData = () => {
    const storageRef = firebase.storage().ref("/");
    let canContinue = true;
    for (let sale of this.state.sales) {
      const canContinueInterval = setInterval(() => {
        if (canContinue) {
          clearInterval(canContinueInterval);
          const imagePath = "/images/" + sale.grade + "/" + sale.imageName;
          titles.push(sale.title);
          descriptions.push(sale.description);
          grades.push(sale.grade);
          sold.push(sale.sold ? "Yes" : "No");
          if (sale.imageName === undefined) {
            imageNames.push(undefined);
          } else {
            canContinue = false;
            storageRef
              .child(imagePath)
              .getDownloadURL()
              .then(downloadURL => {
                imageNames.push(downloadURL);
                canContinue = true;
              });
          }
        }
      }, 1);
    }
  };

  getName = () => {
    firebase
      .database()
      .ref("/users/")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childsnapshot => {
          if (childsnapshot.val().email === this.state.email) {
            this.setState(
              {
                name: childsnapshot.val().name
              },
              () => {
                this.setState({
                  response: true
                });
              }
            );
          }
        });
      });
  };

  currentTabIs = tab => {
    this.setState({
      currentTab: tab
    });
  };

  buttonClicked = tab => {
    this.currentTabIs(tab);
    document.getElementById(tab + "-tab").classList.toggle("selected");
  };

  render() {
    if (this.state.response) {
      return (
        <div>
          <Navbar />

          <h1 id="profile-title">Profile</h1>

          <div id="profile-container">
            <div>
              <button
                onClick={() => this.currentTabIs("General")}
                className="tab-button"
              >
                General
              </button>
              <button
                onClick={() => this.currentTabIs("Sales")}
                className="tab-button"
              >
                Sales
              </button>
              <button
                onClick={() => this.buttonClicked("Purchases")}
                className="tab-button"
                id="Purchases-tab"
              >
                Purchases
              </button>
            </div>

            <div>
              {(() => {
                if (this.state.currentTab === "General")
                  return (
                    <div>
                      <p>Name: {this.state.name}</p>
                      <p>Email: {this.state.email}</p>
                    </div>
                  );
                if (this.state.currentTab === "Sales") {
                  if (this.state.sales.length > 0) {
                    return (
                      <div>
                        <table border="1" id="sales-table">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Grade</th>
                              <th>Sold</th>
                              <th>View Listing</th>
                            </tr>
                          </thead>
                          {this.state.sales.map((sale, i) => {
                            return (
                              <tbody key={i}>
                                <tr>
                                  <td key={"titles" + i}>{titles[i]}</td>
                                  <td key={"descriptions" + i}>
                                    {descriptions[i]}
                                  </td>
                                  <td key={"grades" + i}>{grades[i]}</td>
                                  <td key={"sold" + i}>{sold[i]}</td>
                                  <td>
                                    <Link
                                      to={{
                                        pathname: "/details/" + listingKeys[i],
                                        state: {
                                          title: titles[i],
                                          grade: grades[i],
                                          description: descriptions[i],
                                          sellerUid: this.state.uid,
                                          listingKey: listingKeys[i],
                                          imageUrl: imageNames[i],
                                          sold: sold[i]
                                        }
                                      }}
                                    >
                                      <button type="button">View</button>
                                    </Link>
                                  </td>
                                </tr>
                              </tbody>
                            );
                          })}
                        </table>
                      </div>
                    );
                  } else {
                    return <p>You don't have any sales!</p>;
                  }
                }

                if (this.state.currentTab === "Purchases")
                  return <span>Three</span>;
              })()}
            </div>

            <div />
          </div>
        </div>
      );
    } else {
      return <h1>Loading Profile...</h1>;
    }
  }
}
