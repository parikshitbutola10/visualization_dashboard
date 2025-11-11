import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CountryDistributionChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400, height = 250, radius = Math.min(width, height) / 2;

    const grouped = d3.rollups(
      data.filter(d => d.country),
      v => v.length,
      d => d.country
    ).slice(0, 10); // limit to top 10 countries

    const color = d3.scaleOrdinal()
      .domain(grouped.map(d => d[0]))
      .range(d3.schemeCategory10);

    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(radius - 10);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    g.selectAll("path")
      .data(pie(grouped))
      .join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data[0]))
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    // Add labels
    g.selectAll("text")
      .data(pie(grouped))
      .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text(d => d.data[0]?.slice(0, 8));
  }, [data]);

  return (
    <div>
      <h3>Country Distribution (Top 10)</h3>
      <svg ref={svgRef} width={400} height={250}></svg>
    </div>
  );
};

export default CountryDistributionChart;
