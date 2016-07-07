import React from "react";
import Display from "./Display";

export default class Statistics extends React.Component {
	constructor() {
		super();
	}

	render() { 
		return ( // Text is rendered as span in React 
			<div class = "bottom stats">
				<div class = "timeframe">{"Past Day"}</div>
				<ul>
					<li>μ: {"5500"}</li>
					<li>σ: {"0.27"}</li>
				</ul>
			</div>
		);
	}
}