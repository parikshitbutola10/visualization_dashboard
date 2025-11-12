import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const IntensityChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const grouped = d3.rollups(data, v => d3.mean(v, d => d.intensity), d => d.topic);

    const x = d3.scaleBand()
      .domain(grouped.map(d => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(grouped, d => d[1])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .selectAll("rect")
      .data(grouped)
      .join("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(0) - y(d[1]))
      .attr("width", x.bandwidth())
      .attr("fill", "#4e79a7");

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d => d.slice(0, 6)));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return (
    <div>
      <h3>Average Intensity by Topic</h3>
      <svg ref={svgRef} width={400} height={250}></svg>
    </div>
  );
};

export default IntensityChart;
