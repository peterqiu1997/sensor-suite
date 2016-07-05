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
					<li>μ: {this.props.average(this.props.data)}</li>
					<li>σ: {"Deviation Here"}</li>
					<li>Trend: Upwards</li>
				</ul>
			</div>
		);
	}
}