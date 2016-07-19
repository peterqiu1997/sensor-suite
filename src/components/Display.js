import React from "react";

export default class Display extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class = "bottom">
                <div class = "text">{this.props.value}</div>
                <div class = "unit">{this.props.unit}</div>
            </div>
        );
    }
}