import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Sell from "./components/Sell";
import Listings from "./components/Listings";
import Details from "./components/Details";
import Profile from "./components/Profile";
import Edit from "./components/Edit";
import Bid from "./components/Bid";
import Bids from "./components/Bids";
import NotFound from "./components/NotFound";

export const routing = (
	<Router>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route path="/login" component={Login} />
			<Route path="/signup" component={Signup} />
			<Route path="/sell" component={Sell} />
			<Route path="/grade/:handle" component={Listings} />
			<Route path="/details/:handle" component={Details} />
			<Route path="/profile" component={Profile} />
			<Route path="/edit" component={Edit} />
			<Route path="/bid" component={Bid} />
			<Route path="/bids" component={Bids} />
			<Route component={NotFound} />
		</Switch>
	</Router>
);
