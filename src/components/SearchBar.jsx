import React, { Component } from "react";

import "../css/SearchBar.css";

export default class SearchBar extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="searchbar-div">
        <input
          type="text"
          id="searchbar-input"
          placeholder="Search textbook titles..."
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}
