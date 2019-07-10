import React, { Component } from "react";
import firebase from "firebase";
import Swal from "sweetalert2";

import Navbar from "./Navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Edit.css";

var data = undefined;

var ogTitle;
var ogDescription;
// var ogGrade;

export default class Edit extends Component {
	constructor() {
		super();

		this.state = {
			response: false,
			title: undefined,
			description: undefined
			// grade: undefined
		};
	}

	componentDidMount() {
		data = this.props.location.state;
		ogTitle = data.title;
		ogDescription = data.description;
		// ogGrade = data.grade;
		this.setState({
			title: ogTitle,
			description: ogDescription,
			// grade: ogGrade,
			response: true
		});
	}

	fieldChanged = field => {
		switch (field) {
			case "title":
				this.setState({
					title: document.getElementById("title-input").value
				});
			case "description":
				this.setState({
					description: document.getElementById("description-textarea").value
				});
			// case "grade":
			// 	this.setState({
			// 		grade: document.getElementById("grade-select").value
			// 	});
		}
	};

	cancel = field => {
		switch (field) {
			case "title":
				document.getElementById("title-input").value = ogTitle;
				this.setState({
					title: ogTitle
				});
			case "description":
				document.getElementById("description-textarea").value = ogDescription;
				this.setState({
					description: ogDescription
				});
			// case "grade":
			// 	document.getElementById("grade-select").value = ogGrade;
			// 	this.setState({
			// 		grade: ogGrade
			// 	});
		}
	};

	save = field => {
		const gradeName =
			data.grade === "Diploma Program" ? "diplomaprogram" : data.grade;
		const path = `/listings/${gradeName}/${data.listingKey}`;

		const description =
			field === "description" ? this.state.description : ogDescription;
		const title = field === "title" ? this.state.title : ogTitle;
		// const grade = field === "grade" ? this.state.grade : ogGrade;

		firebase
			.database()
			.ref(path)
			.set({
				description: description,
				email: data.email,
				grade: data.grade,
				// grade: grade,
				imageName: data.imageName,
				sold: data.sold,
				title: title,
				uid: data.uid
			})
			.then(() => {
				switch (field) {
					case "title":
						ogTitle = this.state.title;
						this.setState(
							{
								title: ogTitle
							},
							() => {
								Swal.fire(
									"Success!",
									"Your title has been changed!",
									"success"
								);
							}
						);
					case "description":
						ogDescription = this.state.description;
						this.setState(
							{
								description: ogDescription
							},
							() => {
								Swal.fire(
									"Success!",
									"Your description has been changed!",
									"success"
								);
							}
						);
					// case "grade":
					// 	ogGrade = this.state.grade;
					// 	this.setState(
					// 		{
					// 			grade: ogGrade
					// 		},
					// 		() => {
					// 			Swal.fire(
					// 				"Success!",
					// 				"Your grade has been changed!",
					// 				"success"
					// 			);
					// 		}
					// 	);
				}
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
						{/* <br />
						<label>Grade</label>
						<br />
						<select
							value={this.state.grade}
							id="grade-select"
							onChange={() => this.fieldChanged("grade")}
						>
							<option value="Diploma Program">Diploma Program</option>
							<option value="grade10">Grade 10</option>
							<option value="grade9">Grade 9</option>
							<option value="grade8">Grade 8</option>
						</select>
						{this.state.grade === ogGrade ? (
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
									onClick={() => this.cancel("grade")}
								>
									Cancel
								</button>
								<button
									className="btn btn-dark formButton"
									type="button"
									onClick={() => this.save("grade")}
								>
									Save
								</button>
							</div>
						)} */}
					</form>
				</div>
			);
		} else {
			return <h1>Loading...</h1>;
		}
	}
}
