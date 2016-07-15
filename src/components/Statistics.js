import React from "react";

export default class Statistics extends React.Component {
	constructor() {
		super();
	}

	render() { 
		return ( // Text is rendered as span in React 
			<div class = "bottom stats">
				<div class = "timeframe">{"Statistics"}</div>
				<ul>
					<li>{"Mean: 5500"}</li>
					<li>{"StdDev.: 0.27"}</li>
					<li>{"r: +0.17"}</li>
				</ul>
			</div>
		);
	}
}