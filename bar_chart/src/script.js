import * as d3 from "d3";
import { data } from "./data.json";

const w = 720;
const h = 480;
const padding = { top: 20, right: 30, bottom: 40, left: 60 };

const parseTime = d3.timeParse("%Y-%m-%d");

/**
 * Format quarter based on provided Date object
 * @param {Date} date - the passing value of Date object
 * @returns {string} returns the string formatted quarter
 */
const formatQuarter = (date) => {
	const dateStr = parseTime(date);
	const year = date.getFullYear();
	const quarter = Math.floor(date.getMonth() / 3) + 1;
	return `Q${quarter}${year}`;
};
/** @type {string[]} */ const years = data.map((d) => parseTime(d[0]));
/** @type {number[]} */ const gdp = data.map((d) => d[1]);

const tooltip = d3
	.select("body")
	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip")
	.style("opacity", 0);

// Create scales
const xScale = d3
	.scaleBand()
	.domain(d3.range(data.length))
	.range([padding.left, w - padding.right])
	.padding(0.1);

const xTimeScale = d3
	.scaleTime()
	.domain([d3.min(years), d3.max(years)])
	.range([padding.left, w - padding.right]);

const yScale = d3
	.scaleLinear()
	.domain([0, d3.max(gdp)])
	.range([h - padding.bottom, padding.top]);

// Create SVG
const svg = d3
	.select("body")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
	.attr("id", "title");

// Add bars
svg
	.selectAll("rect")
	.data(data)
	.enter()
	.append("rect")
	.attr("x", (_, i) => xScale(i))
	.attr("y", (d) => yScale(d[1]))
	.attr("width", xScale.bandwidth())
	.attr("height", (d) => h - padding.bottom - yScale(d[1]))
	.attr("fill", "black")
	.attr("class", "bar")
	.attr("data-date", (d) => d[0])
	.attr("data-gdp", (d) => d[1])
	.on("mouseover", function (event, d) {
		d3.select(this)
			.transition()
			.duration(200)
			.attr("fill", "cyan")
			.style("opacity", 0.7);

		tooltip
			.style("opacity", 0.3)
			.attr("data-date", d[0])
			.html(`${formatQuarter(d[0])}<br>${d[1]} Billion`)
			.style("left", event.pageX + 10 + "px")
			.style("top", event.pageY - 28 + "px");
	})
	.on("mouseout", function () {
		d3.select(this)
			.transition()
			.duration(200)
			.attr("fill", "black")
			.style("opacity", 1);

		tooltip.style("opacity", 0);
	})

	.append("title")
	.text((d) => `Date: ${d[0]}\nGDP: $${d[1]} Billion`);

// Add x-axis
const xAxis = d3.axisBottom(xTimeScale);
svg
	.append("g")
	.attr("id", "x-axis")
	.attr("transform", `translate(0, ${h - padding.bottom})`)
	.call(xAxis);

// Add y-axis
const yAxis = d3.axisLeft(yScale);
svg
	.append("g")
	.attr("id", "y-axis")
	.attr("transform", `translate(${padding.left}, 0)`)
	.call(yAxis);

svg
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("x", -h / 2)
	.attr("y", 20)
	.text("GDP (Billions of Dollars)");
