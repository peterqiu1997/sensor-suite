import React from "react";
import Graph from './Graph';
import Display from "./Display";
import Statistics from "./Statistics";

export default class App extends React.Component { 

    constructor() {
        super();

        const temperature = 72,
              humidity = 50,
              pressure = 77.88;

        const clean = true;
              
        const status = clean ? "Clean" : "Contaminated"; // TODO: make data handled by parent element

        this.state = {
            temperature: temperature,
            humidity: humidity, 
            pressure: pressure,
            fahrenheit: "°F",
            percent: "%",
            inchesmercury: "inHg"
        }
    }

    render() { // add everything inside a content row -> 8 column for graph, 4 for data, table layout for other stuffs
        return (
            <div>
                <div class = "container-fluid">
                    <div class = "row-fluid jumbotron">
                        <Graph data = {this.state.data} add = {this.addLast} remove = {this.removeFront}/>
                    </div>
                </div>
                <div class = "container-fluid">
                    <div class = "row-fluid is-flex">
                        <div class = "col-lg-3">
                            <Statistics/>
                        </div>
                        <div class = "col-lg-3">
                            <Display value = {this.state.temperature} unit = {this.state.fahrenheit}/>  
                        </div>   
                        <div class = "col-lg-3">                   
                            <Display value = {this.state.humidity} unit = {this.state.percent}/>
                        </div>
                        <div class = "col-lg-3">   
                            <Display value = {this.state.pressure} unit = {this.state.inchesmercury}/>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
    
}