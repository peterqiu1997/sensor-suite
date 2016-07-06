import React from "react";

export default class Graph extends React.Component {

    constructor() { // sloppy, maybe doesn't matter because never gets state changed outside of class? (isolated)
        super();
        let n = 60,
              duration = 1000;

        let now = Date.now(),
            offLeft = now - (n - 3) * duration,
            firstPoint = offLeft + duration,
            lastPoint = firstPoint + (n - 4) * duration; 

        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        console.log(windowWidth + " " + windowHeight);

        const aspectRatio = 20 / 7;

        const margin = {top: 50, right: 70, bottom: 50, left: 70},
            width = windowWidth * 0.8 - margin.left - margin.right,
            height = windowHeight * 3 / 5 - margin.top - margin.bottom; // TODO CHANGE THIS TO BE RESPONSIVE

        // chop off last two for basis interpolation
        const x = d3.time.scale()
            .domain([firstPoint, lastPoint])
            .range([0, width]);

        const y = d3.scale.linear()
            .domain([0, 10000])
            .range([height, 0]);

        const line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d, i) { 
                      return x(offLeft + i * duration); 
                    })
                    .y(function(d, i) { return y(d); });

        const limit = 7000;

        this.state = {
            n: n,
            duration: duration,
            margin: margin,
            aspectRatio: aspectRatio,
            width: width,
            height: height,
            x: x,
            y: y,
            line: line,
            now: now,
            offLeft: offLeft,
            firstPoint: firstPoint,
            lastPoint: lastPoint, 
            limit: limit
        };

        this.data = d3.range(n).map(function() { return 0; });
        this.tick = this.tick.bind(this);
        this.mount = this.mount.bind(this);
    }

    componentDidMount() {
        this.mount();
        this.tick();
    }

    tick() {
        //updatePoints
        const now = Date.now(),
          offLeft = now - (this.state.n - 3) * this.state.duration,
          firstPoint = offLeft + this.state.duration,
          lastPoint = firstPoint + (this.state.n - 4) * this.state.duration;

        // add new
        this.data.push(Math.random() * 300 + 5000);

        // update scale
        this.state.x = d3.time.scale()
            .domain([firstPoint, lastPoint])
            .range([0, this.state.width]);

        /*this.state.y = d3.time.scale()
            .domain([0, d3.max(data)])
            .range([height, 0]);*/ //------------ TODO CHANGE Y DOMAIN TO EXTENT?

        // slide the x-axis left
        d3.select(".x.axis")
             .transition()
             .duration(this.state.duration)
             .ease("linear")
             .call(d3.svg.axis().scale(this.state.x).orient("bottom"));

        // slide line left
        d3.select(".line")
             .attr("d", this.state.line)
             .attr("transform", null)
             .transition()
             .duration(this.state.duration)
             .ease("linear")
             .attr("transform", "translate(" + this.state.x(offLeft) + ",0)")
             .each("end", this.tick);

        // pop front point
        this.data.shift();
    }

    mount() {
        const width = this.state.width,
              height = this.state.height,
              left = this.state.margin.left,
              right = this.state.margin.right,
              top = this.state.margin.top,
              bottom = this.state.margin.bottom,
              data = this.data,
              line = this.state.line;

        const svg = d3.select("#d3Container").append("svg")
            .attr("width", width + left + right)
            .attr("height", height + top + bottom)
            .append("g")
            .attr("transform", "translate(" + left + "," + top + ")");

        svg.append("clipPath")
            .attr("id","clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        const xAxis = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis().scale(this.state.x).orient("bottom"));

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(this.state.y).orient("left"));

        svg.append("line")
            .attr({
                "x1": 0,
                "y1": this.state.y(this.state.limit),
                "x2": width,
                "y2": this.state.y(this.state.limit)
            })
            .style("stroke", "rgb(189, 189, 189)");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0 - 10) // ------------ TO DO CHANGE THIS TO BE RESPONSIVE, RELATIVE TO WIDTH/HEIGHT
            .attr("class", "title")
            .style("text-anchor", "middle")
            .text("Particle Count");

        svg.append("text")
            .attr("x", width)
            .attr("y", 0 - 10) // ------------ TO DO CHANGE THIS TO BE RESPONSIVE, RELATIVE TO WIDTH/HEIGHT
            .attr("class", "title")
            .style("text-anchor", "end")
            .attr("class", "status")
            .text("Clean");


        svg.append("g")
            .attr("clip-path", "url(#clip)")
            .append("path")
            .datum(data) 
            .attr("class", "line")
            .attr("d", line); 
    }

    // isolate from react
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div id = "d3Container">
            </div>
        );
    }
}