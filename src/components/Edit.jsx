import React, { Component } from "react";
import firebase from "firebase";
import Swal from "sweetalert2";

import Navbar from "./Navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Edit.css";

var data = undefined;

var ogTitle;
var ogDescription;

export default class Edit extends Component {
	constructor() {
		super();

		this.state = {
			response: false,
			title: undefined,
			description: undefined
		};
	}

	componentDidMount() {
		data = this.props.location.state;
		ogTitle = data.title;
		ogDescription = data.description;
		this.setState({
			title: ogTitle,
			description: ogDescription,
			response: true
		});
		console.log(data);
	}

	fieldChanged = field => {
		if (field === "title") {
			this.setState({
				title: document.getElementById("title-input").value
			});
		} else if (field === "description") {
			this.setState({
				description: document.getElementById("description-textarea").value
			});
		}
	};

	cancel = field => {
		if (field === "title") {
			document.getElementById("title-input").value = ogTitle;
			this.setState({
				title: ogTitle
			});
		} else if (field === "description") {
			document.getElementById("description-textarea").value = ogDescription;
			this.setState({
				description: ogDescription
			});
		}
	};

	save = field => {
		this.saveField(field);
	};

	saveField = field => {
		const grade =
			data.grade === "Diploma Program" ? "diplomaprogram" : data.grade;
		const path = `/listings/${grade}/${data.listingKey}`;

		const description =
			field === "description" ? this.state.description : data.description;
		const title = field === "title" ? this.state.title : data.title;

		firebase
			.database()
			.ref(path)
			.set({
				description: description,
				email: data.email,
				grade: data.grade,
				imageName: data.imageName,
				sold: data.sold,
				title: title,
				uid: data.uid
			})
			.then(() => {
				ogTitle = this.state.title;
				this.setState(
					{
						title: ogTitle
					},
					() => {
						Swal.fire("Success!", "Your title has been changed!", "success");
					}
				);
			});
	};

	render() {
		if (this.state.response) {
			return (
				<div>
					<Navbar />
					<h1 id="edit-title">Edit</h1>
					<form id="edit-form">
						<label>Title</label>
						<br />
						<input
							type="text"
							defaultValue={ogTitle}
							onChange={() => this.fieldChanged("title")}
							id="title-input"
						/>
						{this.state.title === ogTitle || this.state.title.length === 0 ? (
							<div>
								<button
									className="btn btn-dark formButton"
									type="button"
									disabled
								>
									Cancel
								</button>
								<button
									className="btn btn-dark formButton"
									type="button"
									disabled
								>
									Save
								</button>
							</div>
						) : (
							<div>
								<button
									className="btn btn-dark formButton"
									type="button"
									onClick={() => this.cancel("title")}
								>
									Cancel
								</button>
								<button
									className="btn btn-dark formButton"
									type="button"
									onClick={() => this.save("title")}
								>
									Save
								</button>
							</div>
						)}
						<br />
						<label>Description</label>
						<br />
						<textarea
							defaultValue={ogDescription}
							id="description-textarea"
							onChange={() => this.fieldChanged("description")}
						/>
						{this.state.description === ogDescription ||
						this.state.description.length === 0 ? (
							<div>
								<button
									className="btn btn-dark formButton"
									type="button"
									disabled
								>
									Cancel
								</button>
								<button
									className="btn btn-dark formButton"
									type="button"
									disabled
								>
									Save
								</button>
							</div>
						) : (
							<div>
								<button
									className="btn btn-dark formButton"
									type="button"
									onClick={() => this.cancel("description")}
								>
									Cancel
								</button>
								<button
									className="btn btn-dark formButton"
									type="button"
									onClick={() => this.save("description")}
								>
									Save
								</button>
							</div>
						)}
					</form>
				</div>
			);
		} else {
			return <h1>Loading...</h1>;
		}
	}
}
