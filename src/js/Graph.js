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

        const margin = {top: 30, right: 50, bottom: 30, left: 50},
            width = 1000 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom; // TODO CHANGE THIS TO BE RESPONSIVE

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

    }

    componentDidMount() {
        
        const width = this.state.width,
              height = this.state.height,
              left = this.state.margin.left,
              right = this.state.margin.right,
              top = this.state.margin.top,
              bottom = this.state.margin.bottom,
              data = this.data,
              line = this.state.line;

        const svg = d3.select("svg")
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

        /*svg.append("text")
            .attr("x", width)
            .attr("y", height + bottom)
            .style("text-anchor", "end")
            .style("font-size", "2.5vh")
            .text("Time");

        /*svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - 55)
            .attr("x", 0)
            .style("text-anchor", "end")
            .style("font-size", "16px")
            .text("Count");*/


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
            .attr("y", 0) // ------------ TO DO CHANGE THIS TO BE RESPONSIVE, RELATIVE TO WIDTH/HEIGHT
            .attr("class", "title")
            .style("text-anchor", "middle")
            .text("Responsive Test");

        svg.append("g")
            .attr("clip-path", "url(#clip)")
            .append("path")
            .datum(data) 
            .attr("class", "line")
            .attr("d", line); 

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

        /*this.state.x = d3.time.scale()
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

    // isolate from react
    shouldComponentUpdate() {
        return false;
    }

    resize() {

    }

    render() {
        return (
            <svg></svg>
        );
    }
}