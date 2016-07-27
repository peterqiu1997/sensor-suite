import React from "react";

export default class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.updateStats();
    }

    render() { 
        return ( // Text is rendered as span in React 
            <div class = "bottom">
            <img src = "./img/reload.svg" class = "refresh" onClick = {this.handleClick}/>
            <div class = "statsTitle">{"Past Day"}</div>
            <ul class = "statsList">
                    <li>{"Mean: " + this.props.mean}</li>
                    <li>{"StdDev: " + this.props.deviation}</li>
                    <li>{"r: +0.17"}</li>
                </ul>
            </div>
        );
    }
}
