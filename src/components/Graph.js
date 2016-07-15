import React from "react";

export default class Graph extends React.Component {

    constructor(props) { // sloppy, maybe doesn't matter because never gets state changed outside of class? (isolated)
        super(props);

        const n = props.n,
              duration = props.duration;

        // 3 and 4 more accurate than 1 and 2 
        const now = Date.now(),
            offLeft = now - (n - 3) * duration,
            firstPoint = offLeft + duration,
            lastPoint = firstPoint + (n - 4) * duration; 

        const windowWidth = window.innerWidth,
              windowHeight = window.innerHeight;

        const margin = {top: 50, right: 75, bottom: 50, left: 75},
            width = windowWidth * 0.8 - margin.left - margin.right,
            height = windowHeight * 3 / 5 - margin.top - margin.bottom; 

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

        this.state = { // only state it needs is entirely D3 
            margin: margin,
            width: width,
            height: height,
            x: x,
            y: y,
            line: line,
        };

        this.tick = this.tick.bind(this);
        this.setState = this.setState.bind(this);
        this.mount = this.mount.bind(this);
    }

    componentDidMount() {
        this.mount();
        this.tick();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.clean) {
            d3.select(".contaminated").attr("class", "clean").text("Clean");
        } else {
            d3.select(".clean").attr("class", "contaminated").text("Contaminated");
        }
    }

    tick() {
        //updatePoints
        const now = Date.now(),
          offLeft = now - (this.props.n - 3) * this.props.duration,
          firstPoint = offLeft + this.props.duration,
          lastPoint = firstPoint + (this.props.n - 4) * this.props.duration;

        // add new
        //const toPush = Math.random() * 3000 + 5000;
        this.props.addLast(); 

        // check if below limit
        this.props.check();

        // update scale
        this.state.x = d3.time.scale()
            .domain([firstPoint, lastPoint])
            .range([0, this.state.width]);

        // slide x-axis <--
        d3.select(".x.axis")
             .transition()
             .duration(this.props.duration)
             .ease("linear")
             .call(d3.svg.axis().scale(this.state.x).orient("bottom"));

        // slide line <--
        d3.select(".line")
             .attr("d", this.state.line)
             .attr("transform", null)
             .transition()
             .duration(this.props.duration)
             .ease("linear")
             .attr("transform", "translate(" + this.state.x(offLeft) + ",0)")
             .each("end", this.tick);

        // emphasize certain times
        d3.selectAll(".x.axis text").each(function() {
            if (this.textContent.length > 3) {
                this.classList.add("bold");
            }
        });

        // pop front point
        this.props.removeFirst();
    }

    mount() {
        const width = this.state.width,
              height = this.state.height,
              left = this.state.margin.left,
              right = this.state.margin.right,
              top = this.state.margin.top,
              bottom = this.state.margin.bottom,
              line = this.state.line;

        const svg = d3.select("#d3Container").append("svg")
            .attr("width", width + left + right)
            .attr("height", height + top + bottom)
            .append("g")
            .attr("transform", "translate(" + left + "," + top + ")");

        const focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none")
            .append("circle")
            .attr("r", 5)
            .append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        svg.append("clipPath")
            .attr("id","clip")
            .append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { console.log("mouseover"); focus.style("display", null); })
            .on("mouseout", function() { console.log("mouseout"); focus.style("display", "none"); })
            .on("mousemove", this.mousemove);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis().scale(this.state.x).orient("bottom"));

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(this.state.y).orient("left"));

        svg.append("line")
            .attr({
                "x1": 0,
                "y1": this.state.y(this.props.limit),
                "x2": width,
                "y2": this.state.y(this.props.limit)
            })
            .style("stroke", "rgb(160, 160, 160)");

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
            .attr("class", "clean")
            .text("Clean");

        svg.append("g")
            .attr("clip-path", "url(#clip)")
            .append("path")
            .datum(this.props.data) 
            .attr("class", "line")
            .attr("d", line); 
    }

    mousemove() {
        console.log("mousemove");
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