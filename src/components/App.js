import React from "react";
import io from "socket.io-client";
import Graph from "./Graph";
import Display from "./Display";
import Statistics from "./Statistics";

export default class App extends React.Component { 

    constructor(props) {
        super(props);
        // "Single source of truth": All data is kept here.
        const temperature = "--",
              humidity = "--",
              pressure = "--",
              count = 0;

        const n = 60,
              duration = 1000,
              limit = 0.07; 
                // limit calculated at from arduinodev's sharp dust sensor tutorial
                // limit of "good" interval

        
        this.socket = io();

        this.checkClean = this.checkClean.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.updateStats = this.updateStats.bind(this);
        this.handleStats = this.handleStats.bind(this);

        this.state = {
            n: n,
            clean: true,
            duration: duration,
            limit: limit,
            temperature: temperature,
            humidity: humidity, 
            pressure: pressure,
            count: count,
            tempunit: "°C",
            humidunit: "%",
            pressureunit: "mb.",
            mean: "--",
            deviation: "--",
            data: d3.range(n).map(function() { return 0; }),
        } 
    }

    componentWillMount() { 
        const socket = this.socket;

        socket.on('update', function(data) {
            if (data.count < 0) {
                data.count = 0;
            }
            
            this.setState({
                count: data.count,
                temperature: data.temperature,
                humidity: data.humidity,
                pressure: data.pressure
            }); 
        }.bind(this)); 

        socket.on('stats', function(result) {
            if (result != "Error") {
                this.handleStats(result);
            }
        }.bind(this));
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
            // make twilio call
        } else if (this.state.data[this.state.n - 2] < this.state.limit && !this.state.clean) {
            this.setState({ clean: true });
        } 
    }

    updateStats() {
        // retrieve most recent data
        this.socket.emit('request'); 
    }

    handleStats(data) {
        const mean = this.mean(data);
        const stddev = this.standardDeviation(mean, data);
        this.setState({
            mean: mean,
            deviation: stddev
        });
    }

    mean(data) {
        let sum = 0;
        data.map(function(x) { 
             if (x.count >= 0) {
                sum += x.count;
             }
        });
        console.log(sum);
        return (sum / data.length).toFixed(4);
    }

    standardDeviation(mean, data) {
        let squaredSum = 0;
        data.map(function(x) {
            if (x.count < 0) {
                x.count = 0;
            }
            const diff = x.count - mean;
            squaredSum += diff * diff;
        });
        return Math.sqrt(squaredSum / data.length).toFixed(4);
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
                            <Statistics mean = {this.state.mean} deviation = {this.state.deviation} updateStats = {this.updateStats}/>
                        </div>
                        <div class = "col-lg-3">
                            <Display value = {this.state.temperature} unit = {this.state.tempunit}/>  
                        </div>   
                        <div class = "col-lg-3">                   
                            <Display value = {this.state.humidity} unit = {this.state.humidunit}/>
                        </div>
                        <div class = "col-lg-3">   
                            <Display value = {this.state.pressure} unit = {this.state.pressureunit}/>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}
