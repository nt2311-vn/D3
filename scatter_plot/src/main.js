import * as d3 from "d3";
import data from "../data.json";

// Height, width and padding
const w = 1920;
const h = 1080;
const padding = { top: 30, bottom: 60, right: 30, left: 60 };

// Data
const years = data.map((d) => d.Year);
const times = data.map((d) => +d.Time);

// Create svg
const svg = d3
	.select("body")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
	.attr("id", "title");

// Create scale
const xScale = d3
	.scaleBand()
	.domain(d3.range(data.length))
	.range([padding.left, w - padding.right])
	.padding(0.1);

const xTimeScale = d3
	.scaleTime()
	.domain(d3.min(years), d3.max(years))
	.range([padding.left, w - padding.right]);

const yScale = d3
	.scaleLinear()
	.domain(0, d3.max(times))
	.range([h - padding.bottom, padding.top]);

// Add dots

svg
	.selectAll("dot")
	.data(data)
	.enter()
	.append("circle")
	.attr("class", "dot")
	.attr("r", 6);
