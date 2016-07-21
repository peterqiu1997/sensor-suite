import React from "react";
import io from "socket.io-client";
import Graph from "./Graph";
import Display from "./Display";
import Statistics from "./Statistics";

export default class App extends React.Component { 

    constructor(props) {
        super(props);
        // "Single source of truth": All data is kept here.
        const temperature = 72,
              humidity = 50,
              pressure = 77.88,
              count = 0;

        const n = 60,
              duration = 1000,
              limit = 7000; // include temp so that temperature/humidity/pressure isnt updated that much

        this.checkClean = this.checkClean.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);

        this.state = {
            n: n,
            clean: true,
            duration: duration,
            limit: limit,
            temperature: temperature,
            humidity: humidity, 
            pressure: pressure,
            count: count,
            fahrenheit: "°F",
            percent: "%",
            inchesmercury: "inHg",
            data: d3.range(n).map(function() { return 0; }),
        } 
    }

    componentWillMount() { 
        const socket = io();

        socket.on('connect', function() { 
            console.log("Client is requesting."); 
            socket.emit('request'); 
        });

        socket.on('response', function(data) {
            console.log("Server gave me: " + data);
        }); 

        socket.on('update', function(data) {
            console.log('Update received!'); // TODO REMOVE
            this.setState({
                count: data.count,
                temperature: data.temperature,
                humidity: data.humidity,
                pressure: data.pressure
            }); 
        }.bind(this)); 

        socket.on('stats', function(data) { 
            console.log(data); 
        });  
    }

    add() {
        this.state.data.push(this.state.count);       
    }

    remove() {
        this.state.data.shift();
    }

    checkClean() { // n - 2 because it is the point at end of graph (current time)
        if (this.state.data[this.state.n - 2] >= this.state.limit && this.state.clean) {
            this.setState({ clean: false });
        } else if (this.state.data[this.state.n - 2] < this.state.limit && !this.state.clean) {
            this.setState({ clean: true });
        } 
    }

    render() { 
        return (
            <div>
                <div class = "container-fluid">
                    <div class = "row-fluid jumbotron">
                        <Graph data = {this.state.data} 
                                n = {this.state.n} 
                                duration = {this.state.duration}
                                clean = {this.state.clean}
                                limit = {this.state.limit} 
                                check = {this.checkClean}
                                addLast = {this.add} 
                                removeFirst = {this.remove}
                        />
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