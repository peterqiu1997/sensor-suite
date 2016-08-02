import React from "react";

export default class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTyping = this.handleTyping.bind(this);
        this.emailValue = "";
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.emailValue);
        this.props.email(this.emailValue);
    }

    handleTyping(event) {
        this.emailValue = event.target.value;
    }

    render() { 
        return ( // Text is rendered as span in React 
            <div class = "bottom">
                <div class = "statsTitle">{"Statistics"}</div>
                <div class="checkbox">
                    <label><input type="checkbox" value="" id="csv"/>CSV</label>
                </div>
                <div class="checkbox">
                    <label><input type="checkbox" value="" id="json"/>JSON</label>
                </div>                
                <form role="form" onSubmit = {this.handleSubmit} id = "email-form">
                    <div class = "form-group">
                        <input type = "email" onChange = {this.handleTyping} class = "form-control" id = "email" placeholder = "type e-mail, press enter"/>
                    </div>
                </form>
            </div>
        );
    }
}
