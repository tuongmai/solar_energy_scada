import React, { useState, useEffect, useRef } from 'react'
import * as d3 from "d3"
import * as moment from 'moment';
import './LineChart.css'

const LineChart = ({ data, measure, graphStep }) => {
    const svgRef = useRef();
    const [parentWidth, setParentWidth] = useState(0);
  
    useEffect(() => {
      const handleResize = () => {
        const parentNode = svgRef.current.parentNode;
        setParentWidth(parentNode.clientWidth);
      };
  
      handleResize(); // Set initial width
      window.addEventListener('resize', handleResize);
  
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    useEffect(() => {
      if (parentWidth === 0) return; // Wait until parent width is set
  
      const margin = { top: 20, right: 60, bottom: 40, left: 80 },
            width = (parentWidth) - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
  
      const svg = d3.select(svgRef.current)
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);
  
      svg.selectAll("*").remove(); // Clear previous content
  
      const g = svg.append("g")
                   .attr("transform", `translate(${margin.left},${margin.top})`);
  
      // Parse the date strings and filter out invalid data
      const parseDate = d3.timeParse("%Q");
      const filteredData = data
        .map(d => ({ ...d, parsedDate: parseDate(d.DateTime) }))
        .filter(d => d.Value !== null && d.Value >= 0);
  
      const x = d3.scaleLinear()
                  .range([0, width])
                  .domain([0, data.length]);
  
      g.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x)
              //  .ticks(24)
               .tickFormat(d => d % 1 === 0 ? d : "")
               .tickSize(0)) // Hide x-axis tick marks
       .selectAll("text")
       .attr("dy", "1em"); // Adjust the y position of x-axis labels
  
      // Y scale and Axis
      const maxValue = d3.max(filteredData, d => d.Value);
      const y = d3.scaleLinear()
                  .domain([0, Math.ceil(maxValue /graphStep) * graphStep])
                  .nice()
                  .range([height, 0]);
  
      g.append("g")
       .call(d3.axisLeft(y)
               .ticks(5)
               .tickValues(d3.range(0, Math.ceil(maxValue /graphStep) * graphStep + 1, graphStep))
               .tickSize(-width)
               .tickFormat(d => d)
             )
       .call(g => g.select(".domain").remove()) // Remove y-axis line
       .call(g => g.selectAll(".tick line")
                   .attr("stroke", "#ccc") // Style grid lines
       );
  
      // Y-axis label
      g.append("text")
       .attr("class", "y-axis-label")
       .attr("text-anchor", "middle")
       .attr("transform", `translate(${-margin.left + 15},${height / 2})rotate(-90)`)
       .text(measure);
  
      // Tooltip
      const tooltip = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);
  
      // Line generator with missing data handling
      const line = d3.line()
                     .defined(d => d.Value !== null && d.Value >= 0)
                    //  .x(d => x(d.parsedDate.getHours() + d.parsedDate.getMinutes() / 60))
                     .x((d, index) => x(index + d.parsedDate.getMinutes() / 60))
                     .y(d => y(d.Value));
  
      // Draw line
      g.append("path")
       .datum(filteredData)
       .attr("class", "line")
       .attr("d", line);
  
      // Points
      g.selectAll(".dot")
       .data(filteredData)
       .enter().append("circle")
       .attr("class", "dot")
      //  .attr("cx", d => x(d.parsedDate.getHours() + d.parsedDate.getMinutes() / 60))
       .attr("cx", (d, index) => x(index + d.parsedDate.getMinutes() / 60))
       .attr("cy", d => y(d.Value))
       .attr("r", 5)
       .on("mouseover", function(event, d) {
         tooltip.transition()
                .duration(200)
                .style("opacity", .9);
         tooltip.html(`${moment(d.parsedDate).format('MMM Do HH:mm')}<br>Value: ${d.Value}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
       })
       .on("mouseout", function() {
         tooltip.transition()
                .duration(500)
                .style("opacity", 0);
       });
  
    }, [data, parentWidth]);
  
    return (
      <>
        <svg ref={svgRef}></svg>
      </>
    );
};

export default LineChart