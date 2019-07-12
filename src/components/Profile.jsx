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
var imageUrls = [];
var imageNames = [];
var emails = [];

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
      sales: null,
      bids: null
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
            this.findBids();
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

  findBids = () => {
    let bids = [];
    firebase.database().ref("/listings/").once("value").then(snapshot => {
      snapshot.forEach(childsnapshot => {
        const listings = Object.values(childsnapshot.val());
        for (let i = 0; i < listings.length; i++) {
          const listing = listings[i];
          if (listing.bidders === undefined) return;
          if(listing.bidders.length === 0) {
            return this.setState({
              bids: []
            })
          }
          for (let bid of listing.bidders) {
            if (bid.uid === this.state.uid) {
              let newBid = {
                amount: bid.amount,
                uid: bid.uid,
                winning: false
              }
              if (listing.winningBid !== undefined && listing.winningBid.amount === bid.amount && listing.winningBid.uid === this.state.uid) {
                newBid.winning = true;
              }
              bids.push(newBid);
            }
          }
        }
        
      })
    }).then(() => {
      console.log(bids);
      this.setState({
        bids: bids
      }, () => {
          this.getName();
      })
    })
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
          // sold.push(sale.sold ? "Yes" : "No");
          sold.push(sale.winningBid ? "Yes" : "No");
          imageNames.push(sale.imageName);
          emails.push(sale.email);
          if (sale.imageName === undefined) {
            imageUrls.push(undefined);
          } else {
            canContinue = false;
            storageRef
              .child(imagePath)
              .getDownloadURL()
              .then(downloadURL => {
                imageUrls.push(downloadURL);
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
    document.getElementsByClassName("tab-button")[0].classList.remove("down");
    document.getElementsByClassName("tab-button")[1].classList.remove("down");
    document.getElementsByClassName("tab-button")[2].classList.remove("down");
    if(tab === "General") {
      document.getElementsByClassName("tab-button")[0].classList.add("down");
    } else if(tab === "Sales") {
      document.getElementsByClassName("tab-button")[1].classList.add("down");
    } else {
      document.getElementsByClassName("tab-button")[2].classList.add("down");
    }
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
                onClick={() => this.currentTabIs("Purchases")}
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
                                          imageUrl: imageUrls[i],
                                          imageName: imageNames[i],
                                          sold: sold[i],
                                          email: emails[i]
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
                  if(this.state.bids.length === 0) {
                    return <p>You haven't placed any bids</p>
                  } else {
                    return <div>
                      <table border="1" id="sales-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Grade</th>
                            <th>Your bid</th>
                            <th>Winner</th>
                            <th>View Listing</th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  }
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
