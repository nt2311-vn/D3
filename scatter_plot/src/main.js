import * as d3 from "d3";
import data from "../data.json";

// Height, width, and padding
const w = 1200;
const h = 600;
const padding = { top: 50, bottom: 100, right: 50, left: 100 };

// Parse time function
const parseTime = d3.timeParse("%Y");
const yearParsed = data.map((d) => parseTime(`${d.Year}`));

// Convert time to Date objects for y-axis
const timeParsed = data.map((d) => {
	const [minutes, seconds] = d.Time.split(":").map(Number);
	return new Date(1970, 0, 1, 0, minutes, seconds); // Use a fixed date for time-only values
});

// Create svg
const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

// Add title (User Story #1)
svg
	.append("text")
	.attr("id", "title")
	.attr("x", w / 2)
	.attr("y", padding.top)
	.attr("text-anchor", "middle")
	.style("font-size", "24px")
	.text("Doping in Professional Bicycle Racing");

// Create scales
const xScale = d3
	.scaleTime()
	.domain([d3.min(yearParsed), d3.max(yearParsed)])
	.range([padding.left, w - padding.right]);

const yScale = d3
	.scaleTime()
	.domain([d3.min(timeParsed), d3.max(timeParsed)])
	.range([h - padding.bottom, padding.top]);

// Add dots (User Story #4, #5, #6, #7, #8)
svg
	.selectAll("dot")
	.data(data)
	.enter()
	.append("circle")
	.attr("class", "dot")
	.attr("r", 6)
	.attr("cx", (d) => xScale(parseTime(`${d.Year}`)))
	.attr("cy", (d) => {
		const [minutes, seconds] = d.Time.split(":").map(Number);
		return yScale(new Date(1970, 0, 1, 0, minutes, seconds));
	})
	.attr("data-xvalue", (d) => parseTime(`${d.Year}`)) // Use Date object for x-value
	.attr("data-yvalue", (d) => {
		const [minutes, seconds] = d.Time.split(":").map(Number);
		return new Date(1970, 0, 1, 0, minutes, seconds); // Use Date object for y-value
	})
	.attr("fill", (d) => (d.Doping ? "red" : "steelblue")) // Color based on doping allegations
	.on("mouseover", (event, d) => {
		tooltip
			.style("opacity", 1)
			.attr("data-year", parseTime(`${d.Year}`)) // User Story #15
			.html(
				`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}${
					d.Doping ? `<br><br>${d.Doping}` : ""
				}`,
			)
			.style("left", `${event.pageX + 10}px`)
			.style("top", `${event.pageY - 20}px`);
	})
	.on("mouseout", () => {
		tooltip.style("opacity", 0);
	});

// Add x-axis (User Story #2, #10, #11)
const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.timeFormat("%Y"));
svg
	.append("g")
	.attr("id", "x-axis")
	.attr("transform", `translate(0, ${h - padding.bottom})`)
	.call(xAxis);

// Add y-axis (User Story #3, #9, #12)
const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
svg
	.append("g")
	.attr("id", "y-axis")
	.attr("transform", `translate(${padding.left}, 0)`)
	.call(yAxis);

// Add legend (User Story #13)
const legend = svg
	.append("g")
	.attr("id", "legend")
	.attr("transform", `translate(${w - padding.right - 100}, ${padding.top})`);

legend
	.append("rect")
	.attr("width", 20)
	.attr("height", 20)
	.attr("fill", "steelblue");

legend.append("text").attr("x", 30).attr("y", 15).text("No Doping Allegations");

legend
	.append("rect")
	.attr("y", 30)
	.attr("width", 20)
	.attr("height", 20)
	.attr("fill", "red");

legend.append("text").attr("x", 30).attr("y", 45).text("Doping Allegations");

// Add tooltip (User Story #14, #15)
const tooltip = d3
	.select("body")
	.append("div")
	.attr("id", "tooltip")
	.style("opacity", 0)
	.style("position", "absolute")
	.style("background", "#fff")
	.style("border", "1px solid #ccc")
	.style("padding", "10px")
	.style("border-radius", "5px");
