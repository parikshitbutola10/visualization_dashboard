import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const YearlyTrendChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    // Setup SVG dimensions
    const width = 500;
    const height = 300;
    const margin = { top: 40, right: 20, bottom: 50, left: 50 };

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Process data
    const yearlyData = d3.rollups(
      data,
      (v) => d3.mean(v, (d) => +d.intensity || 0),
      (d) => d.end_year || "Unknown"
    ).filter(([year]) => year && year !== "Unknown");

    const x = d3
      .scaleBand()
      .domain(yearlyData.map(([year]) => year))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(yearlyData, ([, val]) => val) || 10])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Line generator
    const line = d3
      .line()
      .x(([year]) => x(year) + x.bandwidth() / 2)
      .y(([, val]) => y(val))
      .curve(d3.curveMonotoneX);

    // Draw axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // Draw line
    svg
      .append("path")
      .datum(yearlyData)
      .attr("fill", "none")
      .attr("stroke", "#007bff")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // Dots
    svg
      .selectAll(".dot")
      .data(yearlyData)
      .enter()
      .append("circle")
      .attr("cx", ([year]) => x(year) + x.bandwidth() / 2)
      .attr("cy", ([, val]) => y(val))
      .attr("r", 4)
      .attr("fill", "#007bff");
  }, [data]);

  return (
    <div>
      <h3 style={{ textAlign: "center", color: "#333", marginBottom: "10px" }}>
        📈 Average Intensity by Year
      </h3>
      <div ref={chartRef}></div>
    </div>
  );
};

export default YearlyTrendChart;
