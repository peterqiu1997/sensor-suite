import React from "react";
import Graph from './Graph';
import Display from "./Display";
import Statistics from "./Statistics";

export default class App extends React.Component { 

    constructor() {
        super();

        const temperature = 72 + "°F",
              humidity = 50,
              pressure = 29.88,
              data = [30,40,200]; // TODO: make data handled by parent element


        this.state = {
            data: data,
            temperature: temperature,
            humidity: humidity + "" + "%",
            pressure: pressure 
        }
    }   

    calculateAverage(array) {
        const sum = array.reduce(function(x,y){return x+y;});
        return sum / array.length;
    }

    addLast(data_array) {
        data_array.push(Math.random() * 300 + 5000);
    }

    removeFront(data_array) {
        data_array.shift();
    }
 
    status() {
        return true;
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
                            <Statistics data = {this.state.data} average = {this.calculateAverage}/>
                        </div>
                        <div class = "col-lg-3">
                            <Display value = {this.state.temperature}/>  
                        </div>   
                        <div class = "col-lg-3">                   
                            <Display value = {this.state.humidity}/>
                        </div>
                        <div class = "col-lg-3">   
                            <Display value = {this.state.pressure}/>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}