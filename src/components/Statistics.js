import React from "react";

export default class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(event) {
        event.preventDefault();
        //console.log(event.target.value);
        this.props.email();
    }

    handleChange(event) {

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
                        <input type = "email" class = "form-control" id = "email" placeholder = "type e-mail, press enter"/>
                    </div>
                </form>
            </div>
        );
    }
}
