import React from "react";
import Display from "./Display";

export default class Statistics extends React.Component {
	constructor() {
		super();
	}

	render() { 
		return ( // Text is rendered as span in React 
			<div class = "bottom stats">
				<ul>
					<li>Mean: {"5500"}</li>
					<li>Deviation: {"0.27"}</li>
					<li>Trend: Upwards</li>
				</ul>
			</div>
		);
	}
}