import * as d3 from "d3";
import data from "../data.json";

// Height, width and padding
const w = 1920;
const h = 1080;
const padding = { top: 30, bottom: 60, right: 30, left: 60 };

// Parse time function
const parseTime = d3.timeParse("%Y");
const yearParsed = data.map((d) => parseTime(`${d.Year}`));

const parseMinute = d3.timeParse("%M:%S");
const timeParsed = data.map((d) => parseMinute(d.Time));

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
	.domain([d3.min(yearParsed), d3.max(yearParsed)])
	.range([padding.left, w - padding.right]);

const xTimeScale = d3
	.scaleTime()
	.domain(d3.min(years), d3.max(years))
	.range([padding.left, w - padding.right]);

const yScale = d3
	.scaleLinear()
	.domain(0, d3.max(timeParsed))
	.range([h - padding.bottom, padding.top]);

// Add dots

svg
	.selectAll("dot")
	.data(data)
	.enter()
	.append("circle")
	.attr("class", "dot")
	.attr("r", 6)
	.attr("cx", (d) => xScale(parseTime(d.Year)))
	.attr("cy", (d) => yScale(d.Time))
	.attr("fill", "steelblue");

// Add axis
const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.timeFormat("%Y"));
const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

svg
	.append("g")
	.attr("transform", `translate(0, ${h - padding.bottom})`)
	.call(xAxis);

svg.append("g").attr("transform", `translate(${padding.left}, 0)`).call(yAxis);
