import React from "react";

export default class Display extends React.Component {

    constructor() {
        super(); // NO TITLE NECESSARY? EVERYTHING BLUE, GREEN FLAGS POINTING -> 
    }

    render() {
        return (
            <div class = "bottom">
                <div class = "text">{this.props.value}</div>
            </div>
        );
    }
}