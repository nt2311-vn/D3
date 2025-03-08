import * as d3 from "d3";
import data from "../data.json";

// Height, width and padding
const w = 1920;
const h = 1080;
const padding = { top: 30, bottom: 60, right: 30, left: 60 };

// Data
const years = data.map((d) => d.Year);
const times = data.map((d) => +d.Time);

const svg = d3
	.select("body")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
	.attr("id", "title");

svg.selectAll();
